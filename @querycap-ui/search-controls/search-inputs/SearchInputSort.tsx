import { select, theme } from "@querycap-ui/core/macro";
import { IconArrowDown, IconArrowUp } from "@querycap-ui/icons";
import { Portal, useToggle } from "@querycap/uikit";
import { useObservable, useObservableEffect } from "@reactorx/core";
import { includes, map, split } from "lodash";
import React, { forwardRef, ReactNode, useMemo, useRef } from "react";
import { BehaviorSubject } from "rxjs";
import { distinctUntilChanged, map as rxMap, tap } from "rxjs/operators";
import { displayValue, SearchInputProps } from "../search-box";
import { MenuOptGroup, SelectMenuPopover } from "./Menu";
import { OptionFocusedAttr, useNewSelect } from "./Select";
import { withPreventDefault } from "./utils";

const SortLabel = forwardRef(
  (
    {
      asc,
      children,
      ...otherProps
    }: {
      asc: boolean;
      children: ReactNode;
    } & React.HTMLAttributes<HTMLDivElement>,
    ref,
  ) => {
    return (
      <div
        ref={ref as any}
        css={{
          flex: 1,
          cursor: "pointer",
          padding: "0.4em 0.9em",
          "& > i": {
            opacity: 0.7,
          },
        }}
        {...otherProps}>
        <i>以</i>
        <span css={{ opacity: 1 }}>&nbsp;{children}&nbsp;</span>
        <i>{asc ? "升序排" : "降序排"}</i>
      </div>
    );
  },
);

export const SearchInputSort = ({ defaultValue, display, enum: values = [], onSubmit }: SearchInputProps) => {
  const { sort$, toggleAsc, sortBy } = useMemo(() => {
    const [by, asc] = split(defaultValue || "", "!");

    return {
      sort$: new BehaviorSubject({
        by: includes(values, by) ? by : values[0],
        asc: !!asc,
      }),
      toggleAsc: () => {
        sort$.next({
          ...sort$.value,
          asc: !sort$.value.asc,
        });
      },
      sortBy: (by: string) => {
        sort$.next({
          ...sort$.value,
          by: by,
        });
      },
    };
  }, []);

  const triggerElmRef = useRef<HTMLDivElement>(null);

  const [isOpened, openPopover, closePopover] = useToggle();

  const [ctx, Select] = useNewSelect(sort$.value.by);

  useObservableEffect(() => {
    return [
      sort$.pipe(
        rxMap(({ by, asc }) => `${by}${asc ? "!asc" : ""}`),
        distinctUntilChanged(),
        tap((v) => {
          onSubmit && onSubmit(v);
        }),
      ),
      ctx.selectValue$.pipe(
        tap((selectValue) => {
          sortBy(selectValue);
          closePopover();
        }),
      ),
    ];
  }, []);

  const { asc, by } = useObservable(sort$);

  return (
    <div
      css={select()
        .display("flex")
        .alignItems("center")
        .height("100%")
        .userSelect("none")
        .borderLeft("1px solid")
        .borderColor(theme.state.borderColor)}>
      <SortLabel
        ref={triggerElmRef}
        asc={asc}
        onClick={withPreventDefault(() => (isOpened ? closePopover() : openPopover()))}>
        {displayValue(by, display)}
      </SortLabel>
      <div
        css={{
          opacity: 0.6,
          cursor: "pointer",
          padding: "0.4em 0.9em 0.4em 0",
        }}
        onClick={withPreventDefault(toggleAsc)}>
        {asc ? <IconArrowDown /> : <IconArrowUp />}
      </div>
      {isOpened && (
        <Portal>
          <Select>
            <SelectMenuPopover
              css={{ minWidth: 100 }}
              triggerRef={triggerElmRef}
              onRequestClose={closePopover}
              placement={"bottom-right"}>
              <MenuOptGroup>
                {map(values, (key) => (
                  <SortLabel
                    data-opt={key}
                    key={key}
                    asc={asc}
                    {...{
                      [OptionFocusedAttr]: key === by,
                    }}>
                    {displayValue(key, display)}
                  </SortLabel>
                ))}
              </MenuOptGroup>
            </SelectMenuPopover>
          </Select>
        </Portal>
      )}
    </div>
  );
};
