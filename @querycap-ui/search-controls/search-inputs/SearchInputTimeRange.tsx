import { select, theme } from "@querycap-ui/core/macro";
import { DateWheelPicker } from "@querycap-ui/date-pickers";
import { IconCalendar } from "@querycap-ui/icons";
import { parseRange, stringifyRange } from "@querycap/strfmt";
import { useToggle } from "@querycap/uikit";
import { useObservableEffect } from "@reactorx/core";
import { format, parseISO } from "date-fns";
import { noop } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { fromEvent, merge } from "rxjs";
import { filter as rxFilter, tap } from "rxjs/operators";
import { displayValue, SearchInputProps } from "../search-box";
import { MenuPopover } from "./Menu";
import { useKeyboardArrowControls } from "./Select";
import { withPreventDefault } from "./utils";

export const createTimeRangeDisplay = (f = "yyyy-MM-dd HH:mm") => (v: string) => {
  const r = parseRange(v);

  let d = "";

  if (r.from) {
    d += format(parseISO(r.from), f);
  }

  if (r.to) {
    d += " 至 ";
    d += format(parseISO(r.to), f);
  } else {
    d += " 至今";
  }

  return d;
};

export const SearchInputTimeRange = ({
  minValue,
  maxValue,
  display,
  defaultValue,
  onSubmit,
  onCancel,
}: SearchInputProps & {
  minValue?: string;
  maxValue?: string;
}) => {
  const [timeRange, setTimeRange] = useState(() => parseRange(defaultValue));

  const inputElmRef = useRef<HTMLInputElement>(null);

  const [isOpened, openPopover, closePopover] = useToggle();

  useKeyboardArrowControls(inputElmRef, (d) => {
    switch (d) {
      case "down":
        return;
      case "up":
        return;
    }
  });

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
      <input
        ref={inputElmRef}
        type="text"
        value={String(displayValue(stringifyRange(timeRange), display))}
        onChange={noop}
        readOnly
      />
      {isOpened && (
        <MenuPopover triggerRef={inputElmRef} onRequestClose={() => closePopover()} placement={"bottom-left"}>
          <div css={{ padding: "2em 1em 1.6em" }}>
            <div css={select().display("flex").alignItems("center").with(select("& a").textDecoration("none"))}>
              <DateWheelPicker
                value={timeRange.from || ""}
                minValue={minValue}
                maxValue={maxValue}
                onValueChange={(from) => {
                  setTimeRange((r) => ({ ...r, from: from }));
                }}
              />
              {timeRange.to ? (
                <div css={{ display: "flex", alignItems: "center" }}>
                  <span css={{ opacity: 0.7, paddingLeft: "1em" }}>至</span>
                  <div css={{ position: "relative" }}>
                    <a
                      href={"#"}
                      css={{ padding: "0 2em", position: "absolute" }}
                      onClick={withPreventDefault(() => {
                        setTimeRange((r) => ({ ...r, to: "" }));
                      })}>
                      至今
                    </a>
                    <DateWheelPicker
                      minValue={timeRange.from || minValue}
                      maxValue={maxValue}
                      value={timeRange.to || ""}
                      onValueChange={(to) => {
                        setTimeRange((s) => ({ ...s, to: to }));
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div
                  css={() => ({
                    padding: "4em 4em",
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  })}>
                  <div css={select().color(theme.colors.primary)}>至今</div>
                  <div
                    css={{
                      position: "absolute",
                      bottom: "20%",
                      display: "flex",
                      "& > * + *": { marginLeft: "0.5em" },
                    }}>
                    <span css={{ opacity: 0.7 }}>或</span>
                    <a
                      href={"#"}
                      css={select().colorFill(theme.colors.primary)}
                      onClick={withPreventDefault(() => {
                        setTimeRange((r) => ({ ...r, to: r.from }));
                      })}>
                      <IconCalendar /> &nbsp; 选择日期
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div
            css={{
              padding: "0 1.6em 1.6em",
              display: "flex",
              justifyContent: "flex-end",
              "& > * + *": { marginLeft: "1em" },
            }}>
            <a
              href={"#"}
              css={{ color: "inherit", opacity: 0.7 }}
              onClick={withPreventDefault(() => {
                onCancel();
              })}>
              取消
            </a>
            <a
              href={"#"}
              onClick={withPreventDefault(() => {
                onSubmit(stringifyRange(timeRange));
              })}>
              确定
            </a>
          </div>
        </MenuPopover>
      )}
    </>
  );
};
