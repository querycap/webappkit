import { RequestActor } from "@querycap/request";
import { Actor, useConn, useObservable, useStore } from "@reactorx/core";
import { Status, StatusUnauthorized } from "@reactorx/request";
import { addSeconds, formatRFC3339, isBefore, parseISO } from "date-fns";
import { useMemo } from "react";
import { merge as observableMerge, Observable } from "rxjs";
import { filter as rxFilter, map as rxMap } from "rxjs/operators";

export interface IToken {
  accessToken: string;
  refreshToken: string;
  expireAt: string;
  uid?: string;

  [k: string]: any;
}

export const accessKey = "$$access";

export const hasLogon = (access: IToken = {} as IToken) => {
  return !!access.accessToken && !!access.expireAt && isBefore(new Date(), parseISO(access.expireAt));
};

const AccessActor = Actor.of(accessKey);

const updateAccess = AccessActor.named<IToken>("update").effectOn(accessKey, (_, { arg }) => ({
  ...arg,
}));

const deleteAccess = AccessActor.named<void>("delete").effectOn(accessKey, () => undefined);

export interface IOAuthToken {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  token_type: string;
  uid?: string;
  audience?: string;
}

export const fromOAuthToken = (token: IOAuthToken): IToken => ({
  ...token,
  accessToken: token.access_token,
  refreshToken: token.refresh_token,
  expireAt: formatRFC3339(addSeconds(new Date(), Number(token.expires_in || 0) - 10)),
  uid: token.audience || token.uid,
});

export const useAccessMgr = () => {
  const store$ = useStore();

  const access$ = useConn<any, IToken>(store$, (state = {}) => {
    return state[accessKey];
  });

  const { set, del } = useMemo(() => {
    return {
      set: (access: IToken) => updateAccess.with(access).invoke(store$),
      del: () => deleteAccess.invoke(store$),
    };
  }, []);

  return [access$, set, del] as const;
};

export const useAccess = () => {
  const [access$] = useAccessMgr();
  return useObservable(access$);
};

const errorResponseStatusEqual = (status: Status) => (actor: RequestActor) => {
  return RequestActor.isFailedRequestActor(actor) && actor.arg.status === status;
};

export const createUnauthoriredHandleEpic = () => (actor$: Observable<any>) => {
  return observableMerge(
    actor$.pipe(
      rxFilter(errorResponseStatusEqual(StatusUnauthorized)),
      rxMap(() => deleteAccess.with(undefined)),
    ),
  );
};
