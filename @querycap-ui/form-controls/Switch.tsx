import { animated, cover, safeTextColor, selector, themes, useSpring, useTheme } from "@querycap-ui/core";
import React, { forwardRef, ReactNode, useEffect } from "react";
import { ControlledInput } from "./Input";

export interface SwitchProps extends ControlledInput<boolean> {
  tips?: [ReactNode, ReactNode];
}

export const Switch = forwardRef(({ name, value, tips, onValueChange, disabled, ...props }: SwitchProps, ref) => {
  const ds = useTheme();

  const getStyle = (value: boolean) => {
    if (value) {
      return {
        transform: `translate3d(${tips ? "150%" : "50%"},0,0)`,
        color: disabled ? ds.colors.border : ds.colors.primary,
        onOpacity: 1,
        offOpacity: 0,
      };
    }
    return {
      transform: `translate3d(0,0,0)`,
      color: disabled ? ds.colors.border : ds.colors.gray5,
      onOpacity: 0,
      offOpacity: 1,
    };
  };

  const [styles, set] = useSpring(() => getStyle(value));

  const next = getStyle(value);

  useEffect(() => {
    set(next);
  }, [value]);

  return (
    <label {...props} role="switch" aria-checked={value}>
      <input
        ref={ref as any}
        name={name}
        style={{ display: "none" }}
        type="checkbox"
        value={value as any}
        disabled={disabled}
        onChange={() => !disabled && onValueChange(!value)}
      />
      <animated.div
        style={{
          borderColor: styles.color,
          backgroundColor: styles.color,
        }}
        css={selector()
          .position("relative")
          .display("inline-block")
          .top("0.125em")
          .height("1em")
          .width(tips ? "2.5em" : "1.5em")
          .borderRadius("0.6em")
          .border("1px solid")
          .cursor(!disabled ? "pointer" : "default")}>
        {tips && (
          <div
            css={selector()
              .fontSize("0.6em")
              .textTransform("uppercase")
              .color(safeTextColor(next.color))
              .with(
                selector("& > *")
                  .paddingX(themes.space.s1)
                  .with(cover()),
              )}>
            <animated.span style={{ opacity: styles.onOpacity }} css={{ textAlign: "left" }}>
              {tips[0]}
            </animated.span>
            <animated.span style={{ opacity: styles.offOpacity }} css={{ textAlign: "right" }}>
              {tips[1]}
            </animated.span>
          </div>
        )}

        <animated.div
          style={{
            borderColor: styles.color,
            transform: styles.transform,
          }}
          css={selector()
            .position("absolute")
            .top(-1)
            .left(-1)
            .display("block")
            .height("1em")
            .width("1em")
            .borderRadius("100%")
            .border("2px solid")
            .backgroundColor("white")
            .pointerEvents("none")}
        />
      </animated.div>
    </label>
  );
});
