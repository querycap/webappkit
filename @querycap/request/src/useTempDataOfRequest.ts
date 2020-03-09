import { Actor, useObservableEffect, useSelector, useStore } from "@reactorx/core";
import { useRequest } from "@reactorx/request";
import { useEffect, useMemo } from "react";
import { EMPTY, Subject, timer } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { RequestActor } from "./RequestActor";
import { IStatusError } from "./StatusError";

const TempActor = Actor.of("temp");

const tempKey = (k: string, scope = "") => `${TempActor.group}::${k}${scope ? `::${scope}` : ""}`;

const keyFromActor = (actor: Actor<any, { key: string; scope: string }>) => tempKey(actor.opts.key, actor.opts.scope);

const setData = TempActor.named<any, { key: string }>("set").effectOn(keyFromActor, (_, { arg }) => arg);
const destroy = TempActor.named<undefined, { key: string }>("destroy").effectOn(keyFromActor, () => undefined);

export const useTempDataOfRequest = <TRequestActor extends RequestActor<any, any>>(
  requestActor: TRequestActor,
  arg: TRequestActor["arg"],
  deps: any[] = [],
  cacheKey?: string,
) => {
  const store$ = useStore();
  const resourceExpiresIn$ = useMemo(() => new Subject<number>(), []);

  const data = useSelector(
    store$,
    (state: any = {}): TRequestActor["done"]["arg"]["data"] | undefined => state[tempKey(requestActor.name, cacheKey)],
    deps,
  );

  const [request, requesting$] = useRequest<TRequestActor["arg"], TRequestActor["opts"], IStatusError>(requestActor, {
    arg: arg,
    onSuccess: (actor) => {
      setData.with(actor.arg.data, { key: requestActor.name, scope: cacheKey }).invoke(store$);

      maySetExpiry(actor.arg.headers, (expiresIn: number) => {
        console.warn(`will fetch ${requestActor.name} again after ${expiresIn / 1000}s`);
        resourceExpiresIn$.next(expiresIn);
      });
    },
  });

  useEffect(() => {
    return () => {
      destroy.with(undefined, { key: requestActor.name, scope: cacheKey }).invoke(store$);
    };
  }, []);

  useObservableEffect(() => {
    return resourceExpiresIn$.pipe(
      switchMap((expiresIn) => (expiresIn ? timer(expiresIn) : EMPTY)),
      tap(() => {
        request(undefined);
      }),
    );
  }, []);

  useEffect(() => {
    request(undefined);
  }, deps);

  return [data, request, requesting$] as const;
};

export function maySetExpiry(headers: { [key: string]: string }, cb: (expiresIn: number) => void) {
  let expiresIn: number | null = null;

  if (headers["cache-control"]) {
    const parsedCC = parseCacheControl(headers["cache-control"]);
    if (parsedCC["max-age"]) {
      expiresIn = Number(parsedCC["max-age"]) * 1000;
    }
  } else if (headers["expires"]) {
    expiresIn = new Date(headers["expires"]).getTime() - Date.now();
  }

  if (expiresIn) {
    cb(expiresIn);
  }
}

export function parseCacheControl(cacheControl: string): { [key: string]: string | number } {
  // Taken from [Wreck](https://github.com/hapijs/wreck)
  // eslint-disable-next-line no-control-regex,no-useless-escape
  const re = /(?:^|(?:\s*\,\s*))([^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)(?:\=(?:([^\x00-\x20\(\)<>@\,;\:\\"\/\[\]\?\=\{\}\x7F]+)|(?:\"((?:[^"\\]|\\.)*)\")))?/g;

  const header: { [key: string]: string | number } = {};
  cacheControl.replace(re, (_, $1, $2, $3) => {
    const value = $2 || $3;
    header[$1] = value ? value.toLowerCase() : true;
    return "";
  });

  if (header["max-age"]) {
    const maxAge = parseInt(String(header["max-age"]), 10);
    if (isNaN(maxAge)) {
      delete header["max-age"];
    } else {
      header["max-age"] = maxAge;
    }
  }

  return header;
}
