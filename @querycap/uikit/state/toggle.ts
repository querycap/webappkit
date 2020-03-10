import { useObservable } from "@reactorx/core";
import { useMemo } from "react";
import { BehaviorSubject } from "rxjs";

export const useToggle = <TState extends any>() => {
  const { showed$, show, hide } = useMemo(() => {
    const showed$ = new BehaviorSubject<{
      showed: boolean;
      state?: TState;
    }>({ showed: false });

    return {
      showed$,
      show: (state?: TState) => {
        showed$.next({ showed: true, state });
      },
      hide: (state?: TState) => {
        showed$.next({ showed: false, state });
      },
    };
  }, []);

  const state = useObservable(showed$);

  return [state.showed, show, hide, state.state] as const;
};
