import { cover, preventDefault } from "@querycap-ui/core";
import { select } from "@querycap-ui/core/macro";
import { IconChevronDown, IconX } from "@querycap-ui/icons";
import { FieldInputCommonProps } from "@querycap/form";
import { useValueRef } from "@querycap/reactutils";
import { useToggle } from "@querycap/uikit";
import { useObservableEffect } from "@reactorx/core";
import { map, noop } from "lodash";
import { ReactNode, useLayoutEffect, useMemo, useRef } from "react";
import { fromEvent } from "rxjs";
import { filter as rxFilter, tap } from "rxjs/operators";
import { InputIcon } from "./Input";
import { MenuOptGroup, SelectMenuPopover, useKeyboardArrowControls, useNewSelect } from "./Menu";

export interface InputSelectProps<T extends any = any> extends FieldInputCommonProps<T> {
  enum: any[];
  display?: (v: T) => ReactNode;
  allowClear?: boolean;
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
      rxFilter((v) => !!v),
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
          if (selectCtx.focused$.value) {
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
          value={value}
          css={select().with(cover()).opacity(0).cursor("pointer")}
          readOnly
        />
        <span dangerouslySetInnerHTML={{ __html: `<span>${display(value)}</span>` }}></span>&nbsp;
      </div>
      <InputIcon pullRight>
        {allowClear && value && !valuesRef.current.disabled ? (
          <IconX onClick={() => onValueChange("")} />
        ) : (
          <IconChevronDown
            css={select()
              .transform(`rotate(${isOpened ? 180 : 0}deg)`)
              .transition("transform 200ms ease 0s")}
          />
        )}
      </InputIcon>
      {!valuesRef.current.disabled && isOpened && (
        <Select>
          <SelectMenuPopover fullWidth triggerRef={inputElmRef} onRequestClose={() => closePopover()}>
            <MenuOptGroup>
              {map(values, (value) => (
                <div
                  data-opt={value}
                  key={value}
                  dangerouslySetInnerHTML={{ __html: `<span>${display(value)}</span>` }}>
                  {/* {display(value)} */}
                </div>
              ))}
            </MenuOptGroup>
          </SelectMenuPopover>
        </Select>
      )}
    </>
  );
};
