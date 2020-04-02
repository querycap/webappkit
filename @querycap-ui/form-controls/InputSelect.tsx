import { MenuOptGroup, SelectMenuPopover, useKeyboardArrowControls, useNewSelect } from "@querycap-ui/blocks";
import { cover } from "@querycap-ui/core";
import { select } from "@querycap-ui/core/select";
import { InputIcon } from "@querycap-ui/form-controls";
import { IconChevronDown } from "@querycap-ui/icons";
import { FieldInputCommonProps } from "@querycap/form";
import { useValueRef } from "@querycap/reactutils";
import { useToggle } from "@querycap/uikit";
import { useObservableEffect } from "@reactorx/core";
import { map, noop } from "lodash";
import React, { ReactNode, useEffect, useMemo, useRef } from "react";
import { fromEvent, merge } from "rxjs";
import { filter as rxFilter, tap } from "rxjs/operators";

export interface InputSelectProps<T extends any = any> extends FieldInputCommonProps<T> {
  enum: any[];
  display?: (v: T) => ReactNode;
}

export const InputSelect = ({
  enum: values,
  display = (v: any) => `${v}`,
  value,
  onValueChange,
  onBlur,
  onFocus,
}: InputSelectProps) => {
  const inputElmRef = useRef<HTMLInputElement>(null);

  const propsRef = useValueRef({
    onBlur: onBlur || noop,
    onFocus: onFocus || noop,
  });

  const [isOpened, openPopoverOrigin, closePopoverOrigin] = useToggle();

  const [openPopover, closePopover] = useMemo(
    () => [
      () => {
        openPopoverOrigin();
        propsRef.current.onFocus();
      },
      () => {
        closePopoverOrigin();
        propsRef.current.onBlur();
      },
    ],
    [],
  );

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

  useObservableEffect(() => {
    if (!inputElmRef.current) {
      return;
    }

    return selectCtx.selectValue$.pipe(
      tap((value) => {
        onValueChange(value);
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
      <div role="input" css={select().position("relative")}>
        <input ref={inputElmRef} type="text" value={value} css={select().with(cover()).opacity(0)} onChange={noop} />
        <span>{display(value)}</span>&nbsp;
      </div>
      <InputIcon>
        <IconChevronDown />
      </InputIcon>
      {isOpened && (
        <Select>
          <SelectMenuPopover
            fullWidth
            triggerRef={inputElmRef}
            onRequestClose={() => closePopover()}
            placement={"bottom-left"}>
            <MenuOptGroup>
              {map(values, (value) => (
                <div data-opt={value} key={value}>
                  {display(value)}
                </div>
              ))}
            </MenuOptGroup>
          </SelectMenuPopover>
        </Select>
      )}
    </>
  );
};
