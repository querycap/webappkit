import { Actor, useConn, useStore, Volume } from "@reactorx/core";
import { isFunction } from "lodash";
import { useMemo } from "react";

export type StateReducer<TState> = (state: TState) => TState | undefined;

export type ActorInvoker<TState = any> = (arg: any, opts: any) => void | StateReducer<TState>;

export const createStore =
  <TMeta extends any, TState extends any>({
    group,
    initialState,
    storageKey = ({ group }) => group,
  }: {
    group: string;
    initialState?: TState;
    storageKey?: (meta: TMeta & { group: string }) => string;
  }) =>
  <TActorInvokers extends { [k: string]: ActorInvoker<TState> }>(actorInvokers: TActorInvokers) => {
    const actor = Actor.of(group);

    const actors: any = {};

    for (const name in actorInvokers) {
      const actorInvoker = actorInvokers[name];

      actors[name] = actor.named<any, Parameters<typeof storageKey>[0]>(name).effectOn(
        (actor) => {
          return actorInvoker(actor.arg, actor.opts)
            ? storageKey({
                ...actor.opts,
                group: actor.group,
              })
            : "";
        },
        (state, actor) => {
          const reducer = actorInvoker(actor.arg, actor.opts);
          return reducer ? reducer(typeof state === "undefined" ? initialState : state) : state;
        },
      );
    }

    const useState = (meta: TMeta, defaultState: undefined | TState | (() => TState) = initialState) => {
      if (isFunction(defaultState)) {
        defaultState = defaultState();
      }

      const key = storageKey({
        ...((meta as any) || {}),
        group,
      });

      const store$ = useStore();
      const state$ = useConn<any, TState>(store$, (state) => state[key] || defaultState, [key]) as Volume<any, TState>;

      const actions = useMemo(() => {
        const actions: any = {};

        for (const name in actors) {
          const actor = actors[name];

          actions[name] = (arg: any, opts: any) => {
            actor
              .with(arg, {
                ...opts,
                ...((meta as any) || {}),
              })
              .invoke(store$);
          };
        }

        return actions as {
          [K in keyof TActorInvokers]: (
            arg: Parameters<TActorInvokers[K]>[0],
            opts?: Parameters<TActorInvokers[K]>[1],
          ) => void;
        };
      }, [key]);

      return [state$, actions] as const;
    };

    return {
      useState,
      actors: actors as {
        [K in keyof TActorInvokers]: Actor<
          Parameters<TActorInvokers[K]>[0],
          Parameters<TActorInvokers[K]>[1] extends undefined ? TMeta : Parameters<TActorInvokers[K]>[1] & TMeta
        >;
      },
    };
  };
