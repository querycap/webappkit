import { cover, preventDefault } from "@querycap-ui/core";
import { select } from "@querycap-ui/core/macro";
import { IconChevronDown, IconX } from "@querycap-ui/icons";
import { FieldInputCommonProps } from "@querycap/form";
import { useValueRef } from "@querycap/reactutils";
import { useToggle } from "@querycap/uikit";
import { useObservableEffect } from "@reactorx/core";
import { isNull, isUndefined, map, noop } from "lodash";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { fromEvent } from "rxjs";
import { filter as rxFilter, tap } from "rxjs/operators";
import { InputIcon } from "./Input";
import { MenuOptGroup, SelectMenuPopover, useKeyboardArrowControls, useNewSelect } from "./Menu";

const isValidValue = (v: any) => {
    return !(isUndefined(v) || isNull(v) || v == "");
};

export interface ISelectOption {
    label: string;
    value: any;
}

export interface AutocompleteProps<T extends any = any> extends FieldInputCommonProps<T> {
    enum: ISelectOption[];
    allowClear?: boolean;
    autocomplete?: boolean;
    placeholder?: string;
}


export const AutoComplete = (props: AutocompleteProps) => {
    const {
        enum: values,
        value,
        onValueChange,
        onBlur,
        onFocus,
        disabled,
        readOnly,
        allowClear,
        autocomplete = true,
        placeholder,
    } = props;

    const [searchValue, onSearchValueChange] = useState('');
    const filterValues = useMemo(() => {
        if (searchValue) {
            return values.filter(e => e.label.includes(searchValue))
        }
        return values
    }, [searchValue, values])
    useEffect(() => {
        if (value) {
            const item = values.find(e => `${e.value}` == `${value}`);
            item && onSearchValueChange(item.label)
        }

    }, [value, values])

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
<<<<<<< HEAD
=======
            console.info('----=')
>>>>>>> 8e04c27 (feat: autoComplete)
            onValueChange(values[0].value, true);
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
                    value={`${searchValue}`}
                    css={select().with(cover()).cursor("pointer")}
                    readOnly={!autocomplete}
                    placeholder={placeholder}
                    onChange={(e) => {
                        onSearchValueChange(e.target.value)
                    }}
                />
                <span css={select().opacity(0)}>{isValidValue(value) && value}</span>&nbsp;
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
                            {map(filterValues, (item) => (
                                <div data-opt={`${item.value}`} key={item.label

                                }>
                                    {item.label}
                                </div>
                            ))}
                        </MenuOptGroup>
                    </SelectMenuPopover>
                </Select>
            )}
        </>
    );
};
