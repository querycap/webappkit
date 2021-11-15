import {
  colors,
  rgba,
  safeTextColor,
  select,
  simpleShadow,
  theme,
  roundedEm,
  ThemeState,
  tint,
  tintOrShade,
  transparentize,
} from "@querycap-ui/core/macro";
import { flow } from "lodash";
import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { base } from "./utils";

export enum InputButtonSize {
  LARGE = "LARGE",
  MEDIUM = "MEDIUM",
  SMALL = "SMALL",
}

export type ButtonSizes = keyof typeof InputButtonSize;

export interface ButtonOptions {
  primary?: boolean;
  small?: boolean;
  block?: boolean;
  invisible?: boolean;
  size?: ButtonSizes;
}

export interface ButtonProps extends ButtonOptions, ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

const buttonFontSize = (size: ButtonSizes) => {
  switch (size) {
    case "LARGE":
    case "MEDIUM":
      return theme.fontSizes.s;
    case "SMALL":
      return theme.fontSizes.xs;
  }
};

const buttonFitPaddingY = (size: ButtonSizes) => {
  switch (size) {
    case "LARGE":
      return roundedEm(0.5);
    case "MEDIUM":
      return roundedEm(0.4);
    case "SMALL":
      return roundedEm(0.2);
  }
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ disabled, invisible, primary, small, block, size, ...props }: ButtonProps, ref) => {
    const buttonSize: ButtonSizes = small ? InputButtonSize.SMALL : size ? size : InputButtonSize.MEDIUM;

    const disabledStyle = select("&:disabled")
      .color(colors.gray4)
      .fill(colors.gray4)
      .cursor("not-allowed")
      .with(primary ? select().backgroundColor(colors.gray1).borderColor(colors.gray1) : undefined)
      .with(!primary ? select().borderColor(colors.gray3) : undefined);

    const defaultHoverStyle =
      !disabled &&
      !invisible &&
      select("&:hover")
        .opacity(0.8)
        .cursor("pointer")
        .borderColor(theme.colors.primary)
        .color(theme.colors.primary)
        .fill(theme.colors.primary);

    return (
      <ThemeState
        borderColor={primary ? theme.colors.primary : theme.state.borderColor}
        color={primary ? flow(theme.colors.primary, safeTextColor) : flow(theme.state.color, tintOrShade(0.3))}
        backgroundColor={primary ? theme.colors.primary : flow(theme.state.backgroundColor, tint(0.2))}>
        <button
          ref={ref}
          role={"button"}
          css={select()
            .with(base)
            .lineHeight(InputButtonSize.SMALL === buttonSize ? 1.7 : 1.6)
            .fontSize(buttonFontSize(buttonSize))
            .position("relative")
            .paddingX(block ? 0 : small ? "1.2em" : "1.6em")
            .paddingY(buttonFitPaddingY(buttonSize))
            .display(block ? "block" : "inline-block")
            .alignItems("center")
            .outline("none")
            .whiteSpace("nowrap")
            .backgroundColor(theme.state.backgroundColor)
            .borderColor(theme.state.borderColor)
            .colorFill(theme.state.color)
            .with(block && select().width("100%").justifyContent("center"))
            .with(invisible && select().borderColor("transparent"))
            .with(primary ? undefined : defaultHoverStyle)
            .with(select("& > * + *").marginLeft(roundedEm(0.3)))
            .with(
              invisible
                ? select().color("inherit").opacity(0.9).backgroundColor("transparent")
                : select("&:active").boxShadow(`inset 0 0.15em 0.3em ${rgba(colors.black, 0.15)}`),
            )
            .with(
              invisible
                ? undefined
                : select("&:focus")
                    .outline(0)
                    .zIndex(1)
                    .boxShadow(flow(theme.state.borderColor, transparentize(0.85), simpleShadow("0 0 0 0.2em"))),
            )
            .with(disabledStyle)}
          data-primary={primary}
          aria-disabled={disabled}
          disabled={disabled}
          {...props}
        />
      </ThemeState>
    );
  },
);
