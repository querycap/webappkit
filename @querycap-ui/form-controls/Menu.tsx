import { preventDefault, roundedEm, select, shadows, theme, transparentize } from "@querycap-ui/core/macro";
import { useValueRef } from "@querycap/reactutils";
import {
  getBoundingClientRect,
  IOverlayProps,
  Overlay,
  position,
  useRectOfElement,
  withAutoPlacement,
} from "@querycap/uikit";
import { useObservableEffect } from "@reactorx/core";
import { Dictionary, filter, flow, indexOf, isUndefined, replace, toLower } from "lodash";
import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  RefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { BehaviorSubject, fromEvent, merge, pipe } from "rxjs";
import { distinctUntilChanged, filter as rxFilter, tap } from "rxjs/operators";

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

    const onKey = <T extends {}>(key: string) => rxFilter((e: T) => (e as any).key === key);

    const inputKeydownArrowDown$ = inputKeydown$.pipe(onKey("ArrowDown"));
    const inputKeydownArrowUp$ = inputKeydown$.pipe(onKey("ArrowUp"));
    const inputKeydownArrowLeft$ = inputKeydown$.pipe(onKey("ArrowLeft"));
    const inputKeydownArrowRight$ = inputKeydown$.pipe(onKey("ArrowRight"));

    return [
      merge(inputKeydownArrowDown$, inputKeydownArrowUp$, inputKeydownArrowLeft$, inputKeydownArrowRight$).pipe(
        tap(preventDefault),
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
        onClick: pipe(preventDefault, () => ctx.select()),
      })}
    </>
  );
};

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

export const Menu = forwardRef(({ children, ...otherProps }: { children: ReactNode }, containerRef) => {
  const bodyRect = document.body.getBoundingClientRect();
  const [triggerRect] = useRectOfElement(containerRef as any, true, []);
  const targetHeight = bodyRect.height - triggerRect.top;
  const MAX_HEIGHT = 320;
  const maxHeight = Math.min(MAX_HEIGHT, targetHeight);

  return (
    <div css={select().paddingTop(1)} {...otherProps}>
      <div
        ref={containerRef as any}
        css={select()
          .fontSize(theme.state.fontSize)
          .backgroundColor(theme.state.backgroundColor)
          .colorFill(theme.state.color)
          .borderRadius(theme.radii.s)
          .minWidth(100)
          .width("100%")
          .maxHeight(maxHeight)
          .boxShadow(shadows.medium)
          .padding("0.2em 0")
          .overflowY("auto")}>
        {children}
      </div>
    </div>
  );
});

export function SelectMenu({ children, ...otherProps }: { children: ReactNode }) {
  const ctx = useSelect();

  const containerRef = useRef<HTMLDivElement>(null);

  useObservableEffect(() => {
    if (!containerRef.current) {
      return;
    }

    return [
      ctx.focused$.pipe(
        distinctUntilChanged(),
        tap((focused) => {
          if (!focused) {
            return;
          }

          containerRef.current!.querySelector(`[${OptionFocusedAttr}]`)?.removeAttribute(OptionFocusedAttr);

          const $focusedOpt = containerRef.current!.querySelector(`[data-opt="${focused}"]`) as HTMLElement;

          if ($focusedOpt) {
            $focusedOpt.setAttribute(OptionFocusedAttr, String(true));

            const rect = position($focusedOpt, containerRef.current!);
            const parentRect = getBoundingClientRect(containerRef.current!);

            if (rect.top > parentRect.height - 2) {
              containerRef.current!.scrollTop = rect.top;
            }

            if (rect.top < 0) {
              containerRef.current!.scrollTop += rect.top;
            }
          }
        }),
      ),
    ];
  }, [containerRef.current]);

  return (
    <Menu {...otherProps} ref={containerRef}>
      {children}
    </Menu>
  );
}

export const SelectMenuPopover = withAutoPlacement(
  ({ fullWidth, onRequestClose, updateBy, placement, children, triggerRef }: IOverlayProps) => {
    return (
      <Overlay
        updateBy={updateBy}
        triggerRef={triggerRef}
        placement={placement as any}
        fullWidth={fullWidth}
        onRequestClose={onRequestClose}>
        <SelectMenu>{children}</SelectMenu>
      </Overlay>
    );
  },
);

export function MenuPopover({
  fullWidth,
  onRequestClose,
  updateBy,
  placement,
  children,
  triggerRef,
}: {
  triggerRef: RefObject<HTMLElement>;
  onRequestClose: () => void;
  children: ReactNode;
  fullWidth?: boolean;
  placement?: string;
  updateBy?: any[];
}) {
  const ref = useRef(null);
  return (
    <Overlay
      updateBy={updateBy}
      triggerRef={triggerRef}
      placement={placement as any}
      fullWidth={fullWidth}
      onRequestClose={onRequestClose}>
      <Menu ref={ref}>{children}</Menu>
    </Overlay>
  );
}

export const MenuGroup = ({ children }: { children: ReactNode }) => (
  <div
    css={select()
      .paddingY(roundedEm(0.3))
      .with(select("& + &").borderTop("1px solid").borderColor(theme.state.borderColor))
      .with(
        select("& > *")
          .display("block")
          .overflow("hidden")
          .textOverflow("ellipsis")
          .paddingX("1em")
          .paddingY(roundedEm(0.3))
          .colorFill(theme.state.color)
          .cursor("pointer")
          .with(
            select(`&[${OptionFocusedAttr}=true]`)
              .cursor("pointer")
              .color(theme.state.color)
              .backgroundColor(flow(theme.state.color, transparentize(0.88))),
          ),
      )}>
    {children}
  </div>
);

export const MenuOptGroup = ({ children }: { children: OptGroupProps["children"] }) => (
  <MenuGroup>
    <OptGroup>{children}</OptGroup>
  </MenuGroup>
);
