import { roundedEm } from "@querycap-ui/core";
import { preventDefault, select, theme } from "@querycap-ui/core/macro";
import { MenuOptGroup, OptionFocusedAttr, SelectMenuPopover, useNewSelect } from "@querycap-ui/form-controls";
import { IconArrowDown, IconArrowUp } from "@querycap-ui/icons";
import { Portal, useToggle } from "@querycap/uikit";
import { useObservable, useObservableEffect } from "@reactorx/core";
import { includes, map, split } from "lodash";
import React, { forwardRef, ReactNode, useMemo, useRef } from "react";
import { BehaviorSubject, pipe } from "rxjs";
import { distinctUntilChanged, map as rxMap, tap } from "rxjs/operators";
import { displayValue, SearchInputProps } from "../search-box";

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
      <div ref={ref as any} css={select("& > [role=desc]").opacity(0.4)} {...otherProps}>
        <span>&nbsp;{children}&nbsp;</span>
        <span role={"desc"}>{asc ? "升序排" : "降序排"}</span>
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
      ref={triggerElmRef}
      css={select()
        .display("flex")
        .alignItems("center")
        .height("100%")
        .userSelect("none")
        .borderLeft("1px solid")
        .borderColor(theme.state.borderColor)
        .paddingX(roundedEm(0.2))
        .paddingY(roundedEm(0.2))
        .cursor("pointer")
        .with(select("& > *").paddingX(roundedEm(0.2)))}>
      <SortLabel asc={asc} onClick={pipe(preventDefault, () => (isOpened ? closePopover() : openPopover()))}>
        {displayValue(by, display)}
      </SortLabel>
      <div css={select().opacity(0.6)} onClick={pipe(preventDefault, toggleAsc)}>
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
