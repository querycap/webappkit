import { MenuOptGroup, SelectMenuPopover, useKeyboardArrowControls, useNewSelect } from "@querycap-ui/form-controls";
import { cover, preventDefault, select } from "@querycap-ui/core";
import { useToggle } from "@querycap/uikit";
import { useObservableEffect } from "@reactorx/core";
import { filter, includes, map, noop } from "@querycap/lodash";
import { useEffect, useRef } from "react";
import { fromEvent, merge } from "rxjs";
import { filter as rxFilter, tap } from "rxjs/operators";
import { displayValue, SearchInputProps } from "../search-box";
import { useKeyboardControlsOfSearchBox } from "./hooks";

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
        tap(() => {
          if (selectCtx.focused$.value) {
            selectCtx.select();
            selectCtx.focus("");
          }
        }),
        tap(preventDefault),
      ),

      merge(inputFocus$, inputClick$).pipe(tap(() => openPopover())),
    ];
  }, []);

  useEffect(() => {
    inputElmRef.current?.focus();
  }, []);

  return (
    <>
      <div role="input" css={select().position("relative")}>
        <input
          ref={inputElmRef}
          type="text"
          value={defaultValue || ""}
          css={select().with(cover()).opacity(0)}
          onChange={noop}
        />
        <span>{displayValue(defaultValue || "", display)}</span>&nbsp;
      </div>
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
