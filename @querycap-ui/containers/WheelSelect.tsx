import { animated, cover, mix, rgba, select, theme, useGesture, useSpring, useTheme } from "@querycap-ui/core/macro";
import { map, max, Dictionary, find, reduce } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";

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

const rangeLimit = (v: number, min: number, max: number): [number, boolean] => {
  if (v < min) {
    return [min, true];
  }
  if (v > max) {
    return [max, true];
  }
  return [v, false];
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

const getValueByIdx = (options: PickerOption[], index: number) => {
  return find(options, (_, idx) => index === idx)?.value;
};

const offsetYOfIndex = (options: PickerOption[], i: number, itemHeight: number) => {
  if (i <= 0) {
    i = 0;
  } else if (i >= options.length - 1) {
    i = options.length - 1;
  }
  return -i * itemHeight;
};

export const WheelSelect = ({ sup, value, name, options, itemHeight, onValueChange }: WheelSelectProps) => {
  const columnHeight = itemHeight * 5;
  const t = useTheme();

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

  const [selectIdx, setIdx] = useState(valueIndexes[value]);

  const [{ y }, setY] = useSpring(() => {
    return { y: offsetYOfIndex(options, selectIdx, itemHeight) };
  });

  useEffect(() => {
    setY({ y: offsetYOfIndex(options, selectIdx, itemHeight) });
    onValueChange && onValueChange(getValueByIdx(options, selectIdx)!);
  }, [selectIdx]);

  const offsetYRef = useRef(0);

  const setIdxAndUpdateY = (nextIdx: number) => {
    setIdx(nextIdx);
    setY({ y: offsetYOfIndex(options, nextIdx, itemHeight) });
  };

  const bind = useGesture(
    {
      onWheel: ({ delta }) => {
        const nextY = y.get() - delta[1];

        const [nextIdx, outRange] = rangeLimit(-Math.round(nextY / itemHeight), 0, options.length - 1);

        if (!outRange) {
          setY({ y: nextY });
        }

        setIdxAndUpdateY(nextIdx);
      },
      onDragStart: () => {
        offsetYRef.current = y.get();
      },
      onDrag: ({ movement }) => {
        setY({ y: offsetYRef.current + movement[1] });
      },
      onDragEnd: ({ movement }) => {
        const [nextIdx] = rangeLimit(
          -Math.round((offsetYRef.current + movement[1]) / itemHeight),
          0,
          options.length - 1,
        );
        setIdxAndUpdateY(nextIdx);
      },
    },
    {
      wheel: {
        axis: "y",
      },
    },
  );

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        touchAction: "none", // Disable browser handling of all panning and zooming gestures
        height: columnHeight,
      }}>
      {sup && (
        <div
          css={select().with(cover()).with({
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          })}>
          <small css={select().width("50%").color(theme.colors.primary).textAlign("left")}>
            <span
              style={{
                paddingLeft: `${maxValueLength / 2 + 1}em`,
              }}>
              {sup}
            </span>
          </small>
        </div>
      )}
      <div
        data-name={name}
        css={{
          position: "relative",
          padding: "0 1.6em",
        }}>
        <animated.div
          role={"options"}
          style={{ y }}
          css={select()
            .fontSize("1.4em")
            .with({
              position: "absolute",
              zIndex: 0,
              left: 0,
              right: 0,
              top: `${columnHeight / 2 - itemHeight / 2}px`,
            })
            .with(
              select("& > *").with({
                cursor: "pointer",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
                color: t.state.color,
                textAlign: "center",
                height: itemHeight,
                lineHeight: `${itemHeight}px`,
              }),
            )}>
          {map(options, (option, index) => {
            return (
              <animated.div
                key={option.value}
                data-idx={index}
                data-opt={option.value}
                style={{
                  color: y.to((y) => {
                    const delta = index - Math.round(-(y / itemHeight));
                    return colorIn(t.colors.primary, t.state.color, Math.abs(delta));
                  }),
                  opacity: y.to((y) => {
                    const delta = index - Math.round(-(y / itemHeight));
                    return 1 - Math.abs(delta) * 0.2;
                  }),
                  transform: y.to((y) => {
                    const delta = index - Math.round(-(y / itemHeight));
                    return `scale(${1 - Math.abs(delta) * 0.05})`;
                  }),
                }}>
                {option.label}
              </animated.div>
            );
          })}
        </animated.div>
      </div>
      <div
        {...bind()}
        role={"mask"}
        css={select().with(cover()).with({
          zIndex: 1,
        })}
      />
    </div>
  );
};
