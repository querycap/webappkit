import { Actor, useConn, useObservable, useStore } from "@reactorx/core";
import { addSeconds, formatRFC3339 } from "date-fns";
import { get, isEmpty, isFunction, isObject } from "lodash";
import { createContext, useCallback, useContext } from "react";

const StoreStateScopeContext = createContext({ scope: "" });

export const StoreStateScopeProvider = StoreStateScopeContext.Provider;

export const useStoreStateScope = () => useContext(StoreStateScopeContext).scope;

const StateActor = Actor.of("state");

const updateState = StateActor.named<(prev: any) => any, { key: string }>("update").effectOn(
  (actor) => actor.opts.key,
  (state, actor) => {
    return actor.arg(state);
  },
);

export type TUpdater<T> = (prev: T) => T;

export function useStoreState$<T>(
  topic: string,
  initialState: undefined | T | (() => T),
  persistOpts: { crossTabs?: boolean; expiresIn?: number } = {},
) {
  const scope = useStoreStateScope();

  const finalKey = `${!isEmpty(persistOpts) ? `$${persistOpts.crossTabs ? "$" : ""}` : ""}${topic}${
    scope ? `@${scope}` : ""
  }`;

  const initials = isFunction(initialState) ? initialState() : initialState;

  const store$ = useStore();

  const mayAssignExpireAt = (v: any) => {
    if (isObject(v) && persistOpts.expiresIn) {
      return {
        expireAt: formatRFC3339(addSeconds(new Date(), Number(persistOpts.expiresIn || 0))),
        ...v,
      };
    }
    return v;
  };

  const update = useCallback(
    (stateOrUpdater: T | TUpdater<T>) => {
      return updateState
        .with(
          (prevState: any = initials) => {
            if (isFunction(stateOrUpdater)) {
              return mayAssignExpireAt(stateOrUpdater(prevState));
            }
            return mayAssignExpireAt(stateOrUpdater);
          },
          { key: finalKey },
        )
        .invoke(store$);
    },
    [finalKey],
  );

  const state$ = useConn(store$, (state) => get(state, [finalKey], initials), [finalKey]);

  return [state$, update] as const;
}

export function createUseState<T>(
  topic: string,
  initialState?: T,
  persistOpts: { crossTabs?: boolean; expiresIn?: number } = { crossTabs: true },
) {
  return function () {
    const [state$, update] = useStoreState$<T>(topic, initialState, persistOpts);
    const state = useObservable(state$);
    return [state, update] as const;
  };
}
