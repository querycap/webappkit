import {
  colors,
  rgba,
  roundedEm,
  safeTextColor,
  select,
  simpleShadow,
  theme,
  ThemeState,
  tint,
  tintOrShade,
  transparentize,
} from "@querycap-ui/core/macro";
import { flow } from "lodash";
import React, { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { base } from "./utils";

export interface ButtonOptions {
  primary?: boolean;
  small?: boolean;
  block?: boolean;
  invisible?: boolean;
}

export interface ButtonProps extends ButtonOptions, ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ disabled, invisible, primary, small, block, ...props }: ButtonProps, ref) => {
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
            .position("relative")
            .paddingX(block ? 0 : small ? "1.2em" : "1.6em")
            .paddingY(flow(theme.state.fontSize, roundedEm(small ? 0.25 : 0.5)))
            .display(block ? "block" : "inline-block")
            .alignItems("center")
            .outline("none")
            .backgroundColor(theme.state.backgroundColor)
            .borderColor(theme.state.borderColor)
            .colorFill(theme.state.color)
            .with(block && select().width("100%").justifyContent("center"))
            .with(invisible && select().borderColor("transparent"))
            .with(select("&:hover").opacity(0.8).cursor("pointer"))
            .with(select("& > * + *").marginLeft(theme.space.s1))
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
            .with(select("&:disabled").opacity(0.6).cursor("default"))}
          data-primary={primary}
          aria-disabled={disabled}
          disabled={disabled}
          {...props}
        />
      </ThemeState>
    );
  },
);
