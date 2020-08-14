import { noop } from "lodash";
import { useEffect, useMemo, useRef } from "react";
import { Actor, IDispatch, useStore } from "@reactorx/core";
import { RequestActor } from "./RequestActor";
import { BehaviorSubject, merge as observableMerge, Subject } from "rxjs";
import { filter as rxFilter, tap as rxTap } from "rxjs/operators";

export interface IUseRequestOpts<TReq, TRespBody, TError> {
  arg?: RequestActor<TReq, TRespBody, TError>["arg"];
  opts?: RequestActor<TReq, TRespBody, TError>["opts"];
  required?: boolean;
  onSuccess?: (actor: RequestActor<TReq, TRespBody, TError>["done"], dispatch: IDispatch) => void;
  onFail?: (actor: RequestActor<TReq, TRespBody, TError>["failed"], dispatch: IDispatch) => void;
  onFinish?: (dispatch: IDispatch) => void;
}

export function useRequest<TReq, TRespBody, TError>(
  requestActor: RequestActor<TReq, TRespBody, TError>,
  options: IUseRequestOpts<TReq, TRespBody, TError> = {},
) {
  const { actor$, dispatch } = useStore();
  const requesting$ = useMemo(() => new BehaviorSubject(!!options.required), []);

  const lastRequestActor = useRef<RequestActor<TReq, TRespBody, TError> | null>(null);
  const lastCallbackRef = useRef<Pick<typeof options, "onSuccess" | "onFail">>({});

  const optionsRef = useRef(options);
  useEffect(() => {
    optionsRef.current = options;
  });

  const cancelIfExists = () => {
    lastRequestActor.current && lastRequestActor.current.cancel.invoke({ dispatch });
  };

  useEffect(() => {
    const subject$ = new Subject<Actor>();

    const actorSubscription = actor$.subscribe(subject$);

    const end = (cb: () => void) => {
      lastRequestActor.current = null;
      requesting$.next(false);
      cb();
      (optionsRef.current.onFinish || noop)(dispatch);
    };

    const isSameRequest = <T extends typeof requestActor.done | typeof requestActor.failed>(actor: T) => {
      return lastRequestActor.current === actor.opts.parentActor;
    };

    const subscription = observableMerge(
      subject$.pipe(
        rxFilter(requestActor.done.is),
        rxFilter(isSameRequest),
        rxTap((actor) => {
          end(() => {
            lastCallbackRef.current.onSuccess && lastCallbackRef.current.onSuccess(actor, dispatch);
            optionsRef.current.onSuccess && optionsRef.current.onSuccess(actor, dispatch);
          });
        }),
      ),
      subject$.pipe(
        rxFilter(requestActor.failed.is),
        rxFilter(isSameRequest),
        rxTap((actor) => {
          end(() => {
            lastCallbackRef.current.onFail && lastCallbackRef.current.onFail(actor, dispatch);
            optionsRef.current.onFail && optionsRef.current.onFail(actor, dispatch);
          });
        }),
      ),
    ).subscribe();

    return () => {
      cancelIfExists();
      subscription.unsubscribe();
      actorSubscription.unsubscribe();
    };
  }, [requestActor]);

  const request = useMemo(
    () => (
      arg: typeof options["arg"] = optionsRef.current.arg || ({} as any),
      opts: typeof options["opts"] & Pick<typeof options, "onSuccess" | "onFail"> = {
        ...optionsRef.current.opts,
      },
    ) => {
      cancelIfExists();

      lastCallbackRef.current.onSuccess = opts.onSuccess;
      lastCallbackRef.current.onFail = opts.onFail;

      requesting$.next(true);

      const actor = requestActor.with(arg, opts);
      lastRequestActor.current = actor;
      actor.invoke({ dispatch });
    },
    [],
  );

  return [request, requesting$] as const;
}
