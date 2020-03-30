import { useToggle } from "@querycap/uikit";
import { useObservable, useObservableEffect } from "@reactorx/core";
import { Dictionary, every, forEach, last, map, size, startsWith } from "lodash";
import React, { useEffect, useRef } from "react";
import { fromEvent, merge } from "rxjs";
import { buffer, debounceTime, filter as rxFilter, tap } from "rxjs/operators";
import { MenuOptGroup, SelectMenuPopover } from "./Menu";
import { FilterMeta, FilterValue, useSearchBox } from "../search-box";
import { useKeyboardControlsOfSearchBox } from "./hooks";
import { useKeyboardArrowControls, useNewSelect } from "./Select";

export const SearchInputWild = () => {
  const ctx = useSearchBox();
  const inputElmRef = useRef<HTMLInputElement>(null);

  const {
    filters$,
    focused$,
    focusedFilter$,
    wildSearch$,
    wildSearchInput$,
    filterMetas,
    wildSearchMeta,
    putOrFocusFilter,
    focusFilter,
  } = ctx;

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
    onCancel: () => {
      wildSearchInput$.next("");
    },
    onSubmit: (inputValue) => {
      putOrFocusFilter(inputValue);
    },
  });

  useObservableEffect(() => {
    if (!inputElmRef.current) {
      return;
    }

    return selectCtx.selectValue$.pipe(
      tap((opt) => {
        if (opt === "submit") {
          closePopover();
          inputElmRef.current!.blur();
          return;
        }

        if (startsWith(opt, "filter")) {
          const filterKey = opt.split(":")[1];
          const filterMeta = filterMetas[filterKey];

          if (filterMeta) {
            focusFilter(filterMeta);
            putOrFocusFilter(inputElmRef.current!.value);
          }
        }
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

    const inputKeydownBackspaceWithoutInputValue$ = inputKeydown$.pipe(
      rxFilter((e: KeyboardEvent) => e.key === "Backspace" && !(e.target as HTMLInputElement).value),
    );

    return [
      inputKeydownEnter$.pipe(
        tap((e) => {
          if (selectCtx.focused$.value) {
            selectCtx.select();
            selectCtx.focus("");
          } else {
            selectCtx.select("submit");
          }
          e.preventDefault();
        }),
      ),

      // 双击 Backspace 删除 最后一个
      inputKeydownBackspaceWithoutInputValue$.pipe(
        buffer(inputKeydownBackspaceWithoutInputValue$.pipe(debounceTime(250))),
        rxFilter((l) => l.length >= 2),
        tap(() => {
          const filterValue = last(ctx.filters$.value);
          if (filterValue) {
            ctx.delFilter(filterValue.key, filterValue.value);
          }
        }),
      ),

      merge(inputFocus$, inputClick$).pipe(tap(() => openPopover())),

      focusedFilter$.pipe(
        tap((f) => {
          if (f) {
            inputElmRef.current!.focus();
          }
        }),
      ),
    ];
  }, []);

  const filterValues = useObservable(filters$);
  const wildSearchInput = useObservable(wildSearchInput$);

  useEffect(() => {
    if (focused$.value) {
      inputElmRef.current?.focus();
    }

    return () => {
      // should clear when unmount
      wildSearchInput$.next("");
      wildSearch$.next("");
    };
  }, []);

  return (
    <>
      <input
        ref={inputElmRef}
        type="text"
        value={wildSearchInput || ""}
        onChange={(e) => wildSearchInput$.next(e.target.value)}
        placeholder={`${wildSearchMeta?.label ? `输入 ${wildSearchMeta?.label} 进行` : ""}搜索或筛选...`}
      />
      {isOpened && (
        <Select>
          <SelectMenuPopover
            triggerRef={inputElmRef}
            onRequestClose={closePopover}
            placement={"bottom-left"}
            updateBy={[filterValues]}>
            <MenuOptGroup>
              <div data-opt={"submit"}>按 Enter 键或者点击这里开始搜索</div>
            </MenuOptGroup>
            {!wildSearchInput && (
              <MenuOptGroup>
                {map(filterMetas, (filterMeta) =>
                  filterMeta.target ? null : (
                    <FilterRule
                      data-opt={`filter:${filterMeta.key}`}
                      key={`filter:${filterMeta.key}`}
                      filter={filterMeta}
                      hidden={isFilterHidden(filterValues, filterMeta)}
                    />
                  ),
                )}
              </MenuOptGroup>
            )}
          </SelectMenuPopover>
        </Select>
      )}
    </>
  );
};

function FilterRule({
  hidden,
  filter,
  onClick,
  ...otherProps
}: {
  filter: FilterMeta;
  hidden: boolean;
  onClick?: () => void;
}) {
  return hidden ? null : (
    <div onClick={onClick} {...otherProps}>
      按 {filter.label} 筛选
    </div>
  );
}

function isFilterHidden(filterValues: FilterValue[], f: FilterMeta) {
  const getValues = () => {
    const values: Dictionary<boolean> = {};

    forEach(filterValues, (fv) => {
      if (fv.key === f.key) {
        values[fv.value] = true;
      }
    });

    return values;
  };

  if (f.multiple) {
    if (f.enum) {
      const usedValues = getValues();
      return every(f.enum, (v) => usedValues[v]);
    }
    return false;
  }

  return size(getValues()) > 0;
}
