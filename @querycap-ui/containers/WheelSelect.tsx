import { cover, mix, rgba, select, theme, useTheme } from "@querycap-ui/core/macro";
import { useValueRef } from "@querycap/reactutils";
import { useObservableEffect } from "@reactorx/core";
import { assign, Dictionary, map, max, reduce } from "lodash";
import React, { useEffect, useMemo, useRef } from "react";
import { animationFrameScheduler, BehaviorSubject, fromEvent, merge } from "rxjs";
import {
  delay as rxDelay,
  distinctUntilChanged,
  flatMap,
  map as rxMap,
  observeOn,
  takeUntil,
  tap,
} from "rxjs/operators";

export interface PickerOption {
  label: string;
  value: string;
}

export interface WheelSelectProps {
  name: string;
  value: string;
  options: PickerOption[];
  onValueChange: (v: string) => void;

  itemHeight: number;
  sup?: string;
}

const rangeLimit = (v: number, min: number, max: number) => {
  if (v < min) {
    return min;
  }
  if (v > max) {
    return max;
  }
  return v;
};

export const colorIn = (fromColor: string, toColor: string, amount: number): string => {
  if (amount === 0) {
    return fromColor;
  }

  if (amount >= 1) {
    return toColor;
  }

  return mix(1, rgba(fromColor, 1 - amount), toColor);
};

export const WheelSelect = ({ sup, value, name, options, itemHeight, onValueChange }: WheelSelectProps) => {
  const columnHeight = itemHeight * 5;
  const t = useTheme();

  const transform = (height: number, delta: number) => ({
    color: colorIn(t.colors.primary, t.state.color, Math.abs(delta)),
    opacity: 1 - Math.abs(delta) * 0.2,
    transform: `translate3d(0,${delta * height}px,0) scale(${1 - Math.abs(delta) * 0.1})`,
  });

  const [valueIndexes, maxValueLength] = useMemo(
    () => [
      reduce(
        options,
        (optionsIndexes, opt, i) => ({
          ...optionsIndexes,
          [opt.value]: i,
        }),
        {} as Dictionary<number>,
      ),
      max(map(options, ({ value }) => value.length)) || 0,
    ],
    [options],
  );

  const selectedIndex$ = useMemo(() => new BehaviorSubject(valueIndexes[value] || 0), []);

  useEffect(() => {
    const nextIndex = valueIndexes[value] || 0;

    if (nextIndex !== selectedIndex$.value) {
      selectedIndex$.next(nextIndex);
    }
  }, [value]);

  const containerElmRef = useRef<HTMLDivElement>(null);

  const ctxRef = useValueRef({
    maxIndex: options.length - 1,
    valueIndexes,
    name: name,
    value,
    itemHeight,
    onValueChange,
  });

  useObservableEffect(() => {
    return selectedIndex$.pipe(
      rxMap((v) => rangeLimit(Math.round(v), 0, ctxRef.current.maxIndex)),
      distinctUntilChanged(),
      tap((selectIndex) => {
        onValueChange && onValueChange((options[selectIndex] || {}).value);
      }),
    );
  }, []);

  useObservableEffect(() => {
    if (!containerElmRef.current) {
      return;
    }

    const wheel$ = fromEvent(containerElmRef.current, "wheel");

    const mouseMove$ = merge(
      fromEvent<MouseEvent>(containerElmRef.current, "mousemove"),
      fromEvent<TouchEvent>(containerElmRef.current, "touchmove").pipe(rxMap((e) => e.touches[0])),
    );

    const mouseDown$ = merge(
      fromEvent<MouseEvent>(containerElmRef.current, "mousedown"),
      fromEvent<TouchEvent>(containerElmRef.current, "touchstart").pipe(rxMap((e) => e.touches[0])),
    );

    const mouseUp$ = merge(
      fromEvent<MouseEvent>(document, "mouseup"),
      fromEvent<TouchEvent>(document, "touchend").pipe(rxMap((e) => e.touches[0])),
    );

    return [
      mouseDown$.pipe(
        flatMap((start) => {
          const startIdx = selectedIndex$.value;

          return mouseMove$.pipe(
            rxMap((move) => ({
              e: move,
              nextIdx: startIdx + -(move.clientY - start.clientY) / itemHeight,
            })),
            takeUntil(
              mouseUp$.pipe(
                tap((end) => {
                  selectedIndex$.next(Math.round(selectedIndex$.value));

                  // as click event
                  if (end && Math.abs(end.clientY - start.clientY) < itemHeight) {
                    const target = end.target as HTMLElement;
                    const i = target.getAttribute("data-idx");
                    if (i) {
                      selectedIndex$.next(Number(i));
                    }
                  }
                }),
              ),
            ),
          );
        }),
        tap(({ e, nextIdx }) => {
          if (!containerElmRef.current?.contains(e.target as HTMLElement)) {
            return;
          }

          // disabled transition
          containerElmRef.current.setAttribute("data-transition", "false");

          selectedIndex$.next(nextIdx);
        }),
      ),

      selectedIndex$.pipe(
        tap((selectedIdx) => {
          containerElmRef.current?.querySelectorAll("[data-idx]").forEach((e) => {
            const next = transform(itemHeight, Number(e.getAttribute("data-idx")) - selectedIdx);
            assign((e as HTMLElement).style, next);
          });
        }),
      ),

      // delay enable transition
      selectedIndex$.pipe(
        rxDelay(100),
        tap(() => {
          containerElmRef.current!.setAttribute("data-transition", "true");
        }),
      ),

      wheel$.pipe(
        observeOn(animationFrameScheduler),
        tap((e) => {
          if (!containerElmRef.current?.contains(e.target as HTMLElement)) {
            return;
          }

          // disabled transition
          containerElmRef.current.setAttribute("data-transition", "false");

          const nextIdx = rangeLimit(
            selectedIndex$.value + Math.round((e as WheelEvent).deltaY / 3),
            0,
            ctxRef.current.maxIndex,
          );
          selectedIndex$.next(nextIdx);
        }),
      ),
    ];
  }, [containerElmRef.current]);

  return (
    <div
      data-name={name}
      css={{
        position: "relative",
        overflow: "hidden",
        userSelect: "none",
        pointer: "cursor",

        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 1.6em",
      }}
      style={{
        height: columnHeight,
      }}>
      <small css={select().width("50%").color(theme.colors.primary).textAlign("left")}>
        <span
          style={{
            paddingLeft: `${maxValueLength / 2 + 1}em`,
          }}>
          {sup}
        </span>
      </small>
      <div
        ref={containerElmRef}
        data-transition={true}
        css={select()
          .fontSize("1.4em")
          .with(cover())
          .with(
            select("& > *").with({
              cursor: "pointer",
              position: "absolute",
              top: columnHeight / 2 - itemHeight / 2,
              left: 0,
              width: "100%",
              whiteSpace: "nowrap",
              color: t.state.color,
              textOverflow: "ellipsis",
              textAlign: "center",
              height: itemHeight,
              lineHeight: `${itemHeight}px`,
            }),
          )
          .with(
            select("&[data-transition=true] > *").with({
              transition: "120ms",
              transitionTimingFunction: "ease-out",
            }),
          )}>
        {map(options, (option, index) => {
          if (Math.abs(index - selectedIndex$.value) > 4) {
            return null;
          }

          return (
            <div
              key={option.value}
              data-idx={index}
              data-opt={option.value}
              style={transform(itemHeight, index - selectedIndex$.value)}>
              {option.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};
