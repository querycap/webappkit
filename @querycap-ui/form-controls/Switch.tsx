import { animated, cover, select, theme, ThemeState, tintOrShade, useSpring, useTheme } from "@querycap-ui/core/macro";
import { flow } from "lodash";
import React, { forwardRef, ReactNode, useEffect } from "react";
import { ControlledInput } from "./Input";

export interface SwitchProps extends ControlledInput<boolean> {
  tips?: [ReactNode, ReactNode];
}

const SwitchCore = ({ value, tips }: { value: boolean; tips?: [ReactNode, ReactNode] }) => {
  const ds = useTheme();

  const getStyle = (value: boolean) => {
    if (value) {
      return {
        transform: `translate3d(${tips ? "150%" : "50%"},0,0)`,
        backgroundColor: ds.state.backgroundColor,
        onOpacity: 1,
        offOpacity: 0,
      };
    }

    return {
      transform: `translate3d(0,0,0)`,
      backgroundColor: ds.state.backgroundColor,
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
    <animated.div
      style={{
        borderColor: styles.backgroundColor,
        backgroundColor: styles.backgroundColor,
      }}
      css={select()
        .position("relative")
        .display("inline-block")
        .top("0.125em")
        .height("1em")
        .width(tips ? "2.5em" : "1.5em")
        .borderRadius("0.6em")
        .border("1px solid")}>
      {tips && (
        <div
          css={select()
            .fontSize("0.6em")
            .textTransform("uppercase")
            .color(theme.state.color)
            .with(select("& > *").paddingX(theme.space.s1).with(cover()))}>
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
          borderColor: styles.backgroundColor,
          transform: styles.transform,
        }}
        css={select()
          .position("absolute")
          .top(-1)
          .left(-1)
          .display("block")
          .height("1em")
          .width("1em")
          .borderRadius("100%")
          .border("2px solid")
          .backgroundColor("white")
          .pointerEvents("none")
          .with(
            select("&:before")
              .content(`""`)
              .with(cover())
              .zIndex(1)
              .backgroundColor(flow(theme.state.color, tintOrShade(-0.15)))
              .borderRadius("100%")
              .boxShadow("0 2px 4px 0 rgba(0,0,0,0.3)"),
          )}
      />
    </animated.div>
  );
};

export const Switch = forwardRef(({ name, value, tips, onValueChange, disabled, ...props }: SwitchProps, ref) => {
  return (
    <label {...props} role="switch" aria-checked={value} css={select().cursor(!disabled ? "pointer" : "default")}>
      <input
        ref={ref as any}
        name={name}
        style={{ display: "none" }}
        type="checkbox"
        value={value as any}
        disabled={disabled}
        onChange={() => !disabled && onValueChange(!value)}
      />
      <ThemeState
        backgroundColor={
          disabled
            ? flow(theme.state.backgroundColor, tintOrShade(0.1))
            : value
            ? theme.colors.primary
            : flow(theme.state.backgroundColor, tintOrShade(0.3))
        }
        autoColor>
        <SwitchCore value={value} tips={tips} />
      </ThemeState>
    </label>
  );
});
