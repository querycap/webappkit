import { Actor, useEpic, useStore } from "@reactorx/core";
import { History, Location, PartialLocation, Path } from "history";
import { Observable } from "rxjs";
import { filter, ignoreElements, tap } from "rxjs/operators";
import { RouterProps, Router } from "./Router";
import { useEffect, useMemo } from "react";

export const RouterActor = Actor.of("router");

export const routerActors = {
  push: RouterActor.named<string | PartialLocation>("push"),
  replace: RouterActor.named<string | PartialLocation>("replace"),
  go: RouterActor.named<number>("go"),
  back: RouterActor.named<void>("back"),
  forward: RouterActor.named<void>("forward"),
  // @deprecated use back instead
  goBack: RouterActor.named<void>("back"),
  // @deprecated use forward instead
  goForward: RouterActor.named<void>("forward"),
};

export const locationStorageKey = "_location";

export const routerChanged = RouterActor.named<Location>("changed").effectOn(locationStorageKey, (_, { arg }) => arg);

const createRouterEpic = (history: History) => {
  return (action$: Observable<typeof routerActors.push>) =>
    action$.pipe(
      filter(RouterActor.isSameGroup),
      tap((actor) => {
        switch (actor.name) {
          case "push":
            history.push(actor.arg as Path, actor.arg.stage);
            return;
          case "replace":
            history.replace(actor.arg as Path, actor.arg.stage);
            return;
          case "go":
            history.go(actor.arg as number);
            return;
          case "back":
            history.back();
            return;
          case "forward":
            history.forward();
            return;
        }
      }),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      ignoreElements(),
    );
};

export function ReactorxConnect({ history }: { history: History }) {
  const store$ = useStore();

  // have to do once to load stored location before mount
  useMemo(() => {
    const globalState = store$.getState();
    const storedLocation = globalState[locationStorageKey];
    if (storedLocation) {
      const { state, key, ...to } = storedLocation;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      history.replace(to, state);
    }
  }, []);

  useEffect(() => {
    const unlisten = history.listen(({ location }) => {
      routerChanged.with(location).invoke(store$);
    });
    return () => {
      unlisten();
    };
  }, []);

  useEpic(createRouterEpic(history));

  return null;
}

export function ReactorxRouter({ history, ...otherProps }: RouterProps) {
  return (
    <>
      <ReactorxConnect history={history} />
      <Router {...otherProps} history={history} />
    </>
  );
}
