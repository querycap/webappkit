import {
  animated,
  cover,
  opacify,
  select,
  theme,
  ThemeState,
  tintOrShade,
  useSpring,
  useTheme,
} from "@querycap-ui/core/macro";
import { colors } from "@querycap-ui/core/theme/colors";
import { pipe } from "rxjs";
import { forwardRef, useEffect } from "react";
import { ControlledInput } from "./Input";

export interface SwitchProps extends ControlledInput<boolean> {}

const SwitchCore = ({ value }: { value: boolean }) => {
  const ds = useTheme();
  const getStyle = (value: boolean) => {
    if (value) {
      return {
        transform: `translate3d(100%,0,0)`,
        backgroundColor: ds.state.backgroundColor,
        onOpacity: 1,
        offOpacity: 0,
        borderColor: colors.gray2,
      };
    }

    return {
      transform: `translate3d(0%,0,0)`,
      backgroundColor: ds.state.backgroundColor,
      onOpacity: 0,
      offOpacity: 1,
      borderColor: colors.blue1,
    };
  };

  const [styles, set] = useSpring(() => getStyle(value));

  const next = getStyle(value);

  useEffect(() => {
    set(next);
  }, [value]);

  return (
    <animated.div
      css={select().position("relative").display("inline-block").top("0.125em").height("1em").marginRight(8).width(24)}
    >
      <animated.div
        style={{
          backgroundColor: styles.backgroundColor,
        }}
        css={select()
          .height(8)
          .width("100%")
          .position("absolute")
          .left(0)
          .top("50%")
          .marginTop(-4)
          .borderRadius("0.6em")}
      />
      <animated.div
        style={{
          borderColor: styles.borderColor,
          transform: styles.transform,
        }}
        css={select()
          .position("absolute")
          .top("50%")
          .marginTop(-7)
          .left(0)
          .height(14)
          .width(14)
          .borderRadius("100%")
          .border("1px solid")
          .backgroundColor("white")
          .pointerEvents("none")
          .with(
            select("&:before")
              .content(`""`)
              .with(cover())
              .zIndex(1)
              .backgroundColor(pipe(theme.state.backgroundColor, tintOrShade(-0.1)))
              .borderRadius("100%")
              .boxShadow("0 2px 4px 0 rgba(0,0,0,0.3)"),
          )}
      />
    </animated.div>
  );
};

export const Switch = forwardRef(({ name, value, onValueChange, disabled, ...props }: SwitchProps, ref) => {
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
            ? pipe(theme.state.backgroundColor, tintOrShade(0.1), opacify(0.4))
            : value
            ? theme.colors.primary
            : pipe(theme.state.backgroundColor, tintOrShade(0.1))
        }
        autoColor
      >
        <SwitchCore value={value} />
      </ThemeState>
    </label>
  );
});
