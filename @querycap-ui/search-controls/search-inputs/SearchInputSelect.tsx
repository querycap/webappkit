import { useToggle } from "@querycap/uikit";
import { useObservableEffect } from "@reactorx/core";
import { filter, includes, map, noop } from "lodash";
import React, { useEffect, useRef } from "react";
import { fromEvent, merge } from "rxjs";
import { filter as rxFilter, tap } from "rxjs/operators";
import { displayValue, SearchInputProps } from "../search-box";
import { useKeyboardControlsOfSearchBox } from "./hooks";
import { MenuOptGroup, SelectMenuPopover } from "./Menu";
import { useKeyboardArrowControls, useNewSelect } from "./Select";

export const SearchInputSelect = ({
  enum: values,
  display,
  usedValues,
  defaultValue,
  onSubmit,
  onCancel,
}: SearchInputProps) => {
  const inputElmRef = useRef<HTMLInputElement>(null);

  const [isOpened, openPopover, closePopover] = useToggle();

  const [selectCtx, Select] = useNewSelect();

  useKeyboardArrowControls(inputElmRef, (d) => {
    switch (d) {
      case "down":
        selectCtx.nav(1);
        return;
      case "up":
        selectCtx.nav(-1);
        return;
    }
  });

  useKeyboardControlsOfSearchBox(inputElmRef, {
    onCancel,
    onSubmit,
  });

  useObservableEffect(() => {
    if (!inputElmRef.current) {
      return;
    }

    return selectCtx.selectValue$.pipe(
      tap((value) => {
        onSubmit(value);
      }),
    );
  }, []);

  useObservableEffect(() => {
    if (!inputElmRef.current) {
      return;
    }

    const inputClick$ = fromEvent<MouseEvent>(inputElmRef.current, "click");
    const inputFocus$ = fromEvent<FocusEvent>(inputElmRef.current, "focus");
    const inputKeydown$ = fromEvent<KeyboardEvent>(inputElmRef.current, "keydown");

    const onKey = (k: string) => rxFilter((e: KeyboardEvent) => e.key === k);

    const inputKeydownEnter$ = inputKeydown$.pipe(onKey("Enter"));

    return [
      inputKeydownEnter$.pipe(
        tap((e) => {
          if (selectCtx.focused$.value) {
            selectCtx.select();
            selectCtx.focus("");
          }
          e.preventDefault();
        }),
      ),

      merge(inputFocus$, inputClick$).pipe(tap(() => openPopover())),
    ];
  }, []);

  useEffect(() => {
    inputElmRef.current?.focus();
  }, []);

  return (
    <>
      <input ref={inputElmRef} type="text" value={String(displayValue(defaultValue || "", display))} onChange={noop} />
      {isOpened && (
        <Select>
          <SelectMenuPopover triggerRef={inputElmRef} onRequestClose={() => closePopover()} placement={"bottom-left"}>
            <MenuOptGroup>
              {map(
                filter(values, (v) => !includes(usedValues || [], v)),
                (key) => (
                  <div data-opt={key} key={key}>
                    {displayValue(key, display)}
                  </div>
                ),
              )}
            </MenuOptGroup>
          </SelectMenuPopover>
        </Select>
      )}
    </>
  );
};
