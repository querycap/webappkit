import { colors, rgba, safeTextColor, selector, themes, ThemeState } from "@querycap-ui/core";
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

const createBtnStyle = ({ block, invisible, small }: ButtonOptions) =>
  base
    .position("relative")
    .paddingX(block ? 0 : small ? "1.2em" : "1.6em")
    .paddingY((t) => Math.round((small ? 0.25 : 0.5) * t.state.fontSize))
    .display(block ? "block" : "inline-block")
    .alignItems("center")
    .outline("none")
    .backgroundColor(themes.state.backgroundColor)
    .borderColor(themes.state.borderColor)
    .colorFill(themes.state.color)
    .with(block && selector().width("100%").justifyContent("center"))
    .with(invisible && selector().borderColor("transparent"))
    .with(selector("&:hover").opacity(0.9).cursor("pointer"))
    .with(selector("& > * + *").marginLeft(themes.space.s1))
    .with(invisible ? undefined : selector("&:active").boxShadow(`inset 0 0.15em 0.3em ${rgba(colors.black, 0.15)}`))
    .with(
      invisible
        ? undefined
        : selector("&:focus")
            .outline(0)
            .zIndex(1)
            .boxShadow((t) => `0 0 0 0.2em ${rgba(t.state.borderColor, 0.15)}`),
    )
    .with(selector("&:disabled").opacity(0.6).cursor("default"));

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ disabled, invisible, primary, small, block, ...props }: ButtonProps, ref) => {
    return (
      <ThemeState
        borderColor={themes.colors.primary}
        color={primary ? safeTextColor(themes.colors.primary) : themes.colors.primary}
        backgroundColor={primary ? themes.colors.primary : themes.state.backgroundColor}>
        <button
          ref={ref}
          role={"button"}
          css={createBtnStyle({
            invisible,
            small,
            block,
          })}
          aria-disabled={disabled}
          disabled={disabled}
          {...props}
        />
      </ThemeState>
    );
  },
);
