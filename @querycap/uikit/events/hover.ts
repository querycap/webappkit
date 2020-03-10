import { useValueRef } from "@querycap/reactutils";
import { useObservableEffect } from "@reactorx/core";
import { RefObject } from "react";
import { fromEvent, merge } from "rxjs";
import { distinctUntilChanged, map, tap } from "rxjs/operators";

export const useToggleControlOnHover = (ref: RefObject<HTMLDivElement>, toggle: (toOpen: boolean) => void) => {
  const toggleRef = useValueRef(toggle);

  useObservableEffect(() => {
    if (!ref.current) {
      return;
    }

    return merge(
      fromEvent(ref.current, "mouseover").pipe(map(() => true)),
      fromEvent(ref.current, "mouseenter").pipe(map(() => true)),
      fromEvent(ref.current, "mouseleave").pipe(map(() => false)),
    ).pipe(
      distinctUntilChanged(),
      tap((toOpen) => toggleRef.current(toOpen)),
    );
  }, []);
};
