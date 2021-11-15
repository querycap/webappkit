import { cover, preventDefault } from "@querycap-ui/core";
import { select } from "@querycap-ui/core/macro";
import { IconChevronDown, IconX } from "@querycap-ui/icons";
import { FieldInputCommonProps } from "@querycap/form";
import { useValueRef } from "@querycap/reactutils";
import { useToggle } from "@querycap/uikit";
import { useObservableEffect } from "@reactorx/core";
import { isNull, isUndefined, map, noop } from "lodash";
import { ReactNode, useLayoutEffect, useMemo, useRef } from "react";
import { fromEvent } from "rxjs";
import { filter as rxFilter, tap } from "rxjs/operators";
import { InputIcon } from "./Input";
import { MenuOptGroup, SelectMenuPopover, useKeyboardArrowControls, useNewSelect } from "./Menu";

const isValidValue = (v: any) => {
  return !(isUndefined(v) || isNull(v) || v == "");
};

export interface InputSelectProps<T extends any = any> extends FieldInputCommonProps<T> {
  enum: any[];
  display?: (v: T) => ReactNode;
  allowClear?: boolean;
  placeholder?: string;
}

export const InputSelect = (props: InputSelectProps) => {
  const {
    enum: values,
    display = (v: any) => `${v}`,
    value,
    onValueChange,
    onBlur,
    onFocus,
    disabled,
    readOnly,
    allowClear,
    placeholder,
  } = props;

  const inputElmRef = useRef<HTMLInputElement>(null);

  const [isOpened, openPopoverOrigin, closePopoverOrigin] = useToggle();

  const valuesRef = useValueRef({
    onBlur: onBlur || noop,
    onFocus: onFocus || noop,
    disabled: readOnly || disabled || values.length <= 1,
    isOpened,
  });

  const [openPopover, closePopover] = useMemo(
    () => [
      () => {
        if (!valuesRef.current.disabled) {
          openPopoverOrigin();
          valuesRef.current.onFocus();
        }
      },
      () => {
        if (!valuesRef.current.disabled) {
          closePopoverOrigin();
          valuesRef.current.onBlur();
        }
      },
    ],
    [],
  );

  useLayoutEffect(() => {
    if (!value && values.length > 0) {
      onValueChange(values[0], true);
    }
  }, []);

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
      rxFilter(isValidValue),
      tap((value) => {
        onValueChange(value);
        closePopover();
      }),
    );
  }, []);

  useObservableEffect(() => {
    if (!inputElmRef.current) {
      return;
    }

    const inputClick$ = fromEvent<MouseEvent>(inputElmRef.current, "click");
    // const inputFocus$ = fromEvent<FocusEvent>(inputElmRef.current, "focus");
    const inputKeydown$ = fromEvent<KeyboardEvent>(inputElmRef.current, "keydown");

    const onKey = (k: string) => rxFilter((e: KeyboardEvent) => e.key === k);

    const inputKeydownEnter$ = inputKeydown$.pipe(onKey("Enter"));

    return [
      inputKeydownEnter$.pipe(
        tap(() => {
          if (isValidValue(selectCtx.focused$.value)) {
            selectCtx.select();
            selectCtx.focus("");
          }
        }),
        tap(preventDefault),
      ),

      inputClick$.pipe(
        tap(() => {
          valuesRef.current.isOpened ? closePopover() : openPopover();
        }),
      ),
    ];
  }, []);

  return (
    <>
      <div role="input" css={select().position("relative")}>
        <input
          ref={inputElmRef}
          type="text"
          value={`${value}`}
          css={select().with(cover()).opacity(0).cursor("pointer")}
          readOnly
        />
        {!value && <span css={select().color('#9ca1aa')}>{placeholder}</span>}
        <span>{isValidValue(value) && display(value)}</span>&nbsp;
      </div>
      {allowClear && isValidValue(value) && !valuesRef.current.disabled ? (
        <InputIcon pullRight>
          <IconX onClick={() => onValueChange("")} />
        </InputIcon>
      ) : (
        <InputIcon pullRight css={select().pointerEvents("none")}>
          <IconChevronDown
            css={select()
              .transform(`rotate(${isOpened ? 180 : 0}deg)`)
              .transition("transform 200ms ease 0s")}
          />
        </InputIcon>
      )}
      {!valuesRef.current.disabled && isOpened && (
        <Select>
          <SelectMenuPopover fullWidth triggerRef={inputElmRef} onRequestClose={() => closePopover()}>
            <MenuOptGroup>
              {map(values, (value) => (
                <div data-opt={`${value}`} key={value}>
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
