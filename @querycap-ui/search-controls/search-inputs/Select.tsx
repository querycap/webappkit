import { useValueRef } from "@querycap/reactutils";
import { useObservableEffect } from "@reactorx/core";
import { Dictionary, filter, indexOf, isUndefined, replace, toLower } from "lodash";
import React, {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  ReactElement,
  ReactNode,
  RefObject,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { BehaviorSubject, fromEvent, merge } from "rxjs";
import { filter as rxFilter, tap } from "rxjs/operators";

const rangeLimit = (v: number, min: number, max: number) => {
  if (v < min) {
    return min;
  }
  if (v > max) {
    return max;
  }
  return v;
};

const createSelectMgr = (value = "") => {
  const focused$ = new BehaviorSubject<string>(value);
  const selectValue$ = new BehaviorSubject<string>(value);

  const optionSet: Dictionary<boolean> = {};
  const orders: string[] = [];

  const registerOption = (option: string) => {
    // keep order
    if (isUndefined(optionSet[option])) {
      orders.push(option);
    }

    optionSet[option] = true;

    return () => {
      optionSet[option] = false;
    };
  };

  const focus = (value: string) => {
    focused$.next(value);
  };

  const nav = (direction: number) => {
    const options = filter(orders, (o) => optionSet[o]);

    const currentIdx = indexOf(options, focused$.value);

    const idx = rangeLimit(currentIdx + direction, 0, options.length - 1);

    focus(options[idx]);
  };

  const select = (value?: string) => {
    if (value) {
      focus(value);
    }

    selectValue$.next(focused$.value);
  };

  return {
    focused$,
    selectValue$,
    registerOption,
    nav,
    focus,
    select,
  };
};

const SelectContext = createContext({} as { select: ReturnType<typeof createSelectMgr> });
const SelectContextProvider = SelectContext.Provider;

export const useSelect = () => useContext(SelectContext).select;

export const useKeyboardArrowControls = (
  inputElmRef: RefObject<HTMLInputElement | null>,
  nav: (direction: "down" | "left" | "up" | "right") => void,
  disabled?: boolean,
) => {
  const navRef = useValueRef(nav);

  useObservableEffect(() => {
    if (disabled || !inputElmRef.current) {
      return;
    }

    const inputElem = inputElmRef.current;

    const inputKeydown$ = fromEvent<KeyboardEvent>(inputElem, "keydown");

    const onKey = <T extends any>(key: string) => rxFilter((e: T) => e.key === key);

    const inputKeydownArrowDown$ = inputKeydown$.pipe(onKey("ArrowDown"));
    const inputKeydownArrowUp$ = inputKeydown$.pipe(onKey("ArrowUp"));
    const inputKeydownArrowLeft$ = inputKeydown$.pipe(onKey("ArrowLeft"));
    const inputKeydownArrowRight$ = inputKeydown$.pipe(onKey("ArrowRight"));

    return [
      merge(inputKeydownArrowDown$, inputKeydownArrowUp$, inputKeydownArrowLeft$, inputKeydownArrowRight$).pipe(
        tap((e) => {
          navRef.current(toLower(replace(e.key, "Arrow", "")) as any);
        }),
      ),
    ];
  }, [inputElmRef.current, disabled]);
};

export const useNewSelect = (defaultValue = "") => {
  return useMemo(() => {
    const ctx = createSelectMgr(defaultValue);

    const Select = ({ children }: { children: ReactNode }) => {
      return <SelectContextProvider value={{ select: ctx }}>{children}</SelectContextProvider>;
    };

    return [ctx, Select] as const;
  }, []);
};

export const OptionFocusedAttr = "data-opt-focused";

export interface OptGroupProps<T = ReactElement<{ "data-opt": string }> | null> {
  children: T | Array<T>;
}

export const OptGroup = ({ children }: OptGroupProps) => {
  return (
    <>
      {Children.map(children, (elem) => {
        if (isValidElement<{ "data-opt": string; hidden?: boolean }>(elem) && !elem.props["hidden"]) {
          return <Option value={elem.props["data-opt"]}>{elem}</Option>;
        }
        return elem;
      })}
    </>
  );
};

export const Option = ({ value, children }: { value: string; children: ReactElement }) => {
  const ctx = useSelect();

  useEffect(() => {
    const unregister = ctx.registerOption(value);

    return () => {
      unregister();
    };
  }, [value]);

  return (
    <>
      {cloneElement(children, {
        onMouseOver: () => {
          ctx.focus(value);
        },
        onClick: (e: MouseEvent) => {
          e.preventDefault();
          ctx.select();
        },
      })}
    </>
  );
};
