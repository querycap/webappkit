import { useValueRef } from "@querycap/reactutils";
import { useObservableEffect } from "@reactorx/core";
import { last } from "lodash";
import { RefObject } from "react";
import { fromEvent, merge } from "rxjs";
import { buffer, debounceTime, filter as rxFilter, map as rxMap, tap } from "rxjs/operators";

export const useKeyboardControlsOfSearchBox = (
  inputElmRef: RefObject<HTMLInputElement>,
  opts: {
    onSubmit: (v: string) => void;
    onCancel: () => void;
  } = {} as any,
) => {
  const optsRef = useValueRef(opts);

  useObservableEffect(() => {
    if (!inputElmRef.current) {
      return;
    }

    const inputElm = inputElmRef.current;

    const inputKeydown$ = fromEvent<KeyboardEvent>(inputElm, "keydown");

    const onKey = (k: string) => rxFilter((e: KeyboardEvent) => e.key === k);

    const inputKeydownEnter$ = inputKeydown$.pipe(onKey("Enter"));
    const inputKeydownTab$ = inputKeydown$.pipe(onKey("Tab"));
    const inputKeydownEscape$ = inputKeydown$.pipe(onKey("Escape"));

    const inputKeydownBackspaceWithoutInputValue$ = inputKeydown$.pipe(
      rxFilter((e: KeyboardEvent) => e.key === "Backspace" && !(e.target as HTMLInputElement).value),
    );

    return [
      // 单击 Escape, 双击 Enter 或者 Backspace, 取消
      merge(
        inputKeydownEscape$,
        inputKeydownEnter$.pipe(
          buffer(inputKeydownEnter$.pipe(debounceTime(250))),
          rxFilter((l) => l.length >= 2),
          rxMap((events) => last(events)),
        ),
        inputKeydownBackspaceWithoutInputValue$.pipe(
          buffer(inputKeydownBackspaceWithoutInputValue$.pipe(debounceTime(250))),
          rxFilter((l) => l.length >= 2),
          rxMap((events) => last(events)),
        ),
      ).pipe(
        tap((e) => {
          e?.preventDefault();
          optsRef.current.onCancel && optsRef.current.onCancel();
        }),
      ),

      merge(inputKeydownTab$, inputKeydownEnter$).pipe(
        tap((e) => {
          optsRef.current.onSubmit && optsRef.current.onSubmit((e.target as HTMLInputElement).value);
          e.preventDefault();
        }),
      ),
    ];
  }, [inputElmRef.current]);
};
