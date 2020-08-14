import { Actor, useEpic, useStore } from "@reactorx/core";
import { History, LocationDescriptorObject, Path } from "history";
import { Observable } from "rxjs";
import { filter, ignoreElements, tap } from "rxjs/operators";
import { IRouterProps, Router } from "./Router";
import React, { useEffect, useMemo } from "react";

export const RouterActor = Actor.of("router");

export const routerActors = {
  push: RouterActor.named<Path | LocationDescriptorObject>("push"),
  replace: RouterActor.named<Path | LocationDescriptorObject>("replace"),
  go: RouterActor.named<number>("go"),
  goBack: RouterActor.named<void>("goBack"),
  goForward: RouterActor.named<void>("goForward"),
};

export const locationStorageKey = "_location";

export const routerChanged = RouterActor.named<LocationDescriptorObject>("changed").effectOn(
  locationStorageKey,
  (_, { arg }) => arg,
);

export function ReactorxRouter({ history, ...otherProps }: IRouterProps) {
  return (
    <>
      <ReactorxConnect history={history} />
      <Router {...otherProps} history={history} />
    </>
  );
}

const createRouterEpic = (history: History) => {
  return (action$: Observable<typeof routerActors.push>) =>
    action$.pipe(
      filter(RouterActor.isSameGroup),
      tap((actor) => {
        switch (actor.name) {
          case "push":
            history.push(actor.arg);
            return;
          case "replace":
            history.replace(actor.arg);
            return;
          case "go":
            history.go(actor.arg);
            return;
          case "goBack":
            history.goBack();
            return;
          case "goForward":
            history.goForward();
            return;
        }
      }),
      ignoreElements(),
    );
};

export function ReactorxConnect({ history }: { history: History }) {
  const store$ = useStore();

  // have to do once to load stored location before mount
  useMemo(() => {
    const state = store$.getState();
    if (state[locationStorageKey]) {
      history.replace(state[locationStorageKey]);
    }
  }, []);

  useEffect(() => {
    const unlisten = history.listen((location) => {
      routerChanged.with(location).invoke(store$);
    });
    return () => {
      unlisten();
    };
  }, []);

  useEpic(createRouterEpic(history));

  return null;
}
