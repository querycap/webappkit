import { rgba, safeTextColor, selector, themes } from "@querycap-ui/core";
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

const createBtnStyle = ({ block, invisible, primary, small }: ButtonOptions) =>
  base
    .position("relative")
    .paddingX(block ? 0 : small ? "0.8em" : "1em")
    .paddingY(small ? "0.25em" : "0.5em")
    .display(block ? "block" : "inline-block")
    .alignItems("center")
    .outline("none")
    .with(
      primary && !invisible
        ? selector()
            .backgroundColor(themes.colors.primary)
            .borderColor(themes.colors.primary)
            .colorFill(safeTextColor(themes.colors.primary))
        : selector()
            .borderColor(themes.colors.primary)
            .backgroundColor(themes.colors.textLight)
            .colorFill(themes.colors.primary),
    )
    .with(
      block &&
        selector()
          .width("100%")
          .justifyContent("center"),
    )
    .with(invisible && selector().borderColor("transparent"))
    .with(
      selector("&:hover")
        .opacity(0.9)
        .cursor("pointer"),
    )
    .with(selector("& > * + *").marginLeft(themes.space.s1))
    .with(
      invisible
        ? undefined
        : selector("&:active").boxShadow((t) => `inset 0 0.15em 0.3em ${rgba(t.colors.black, 0.15)}`),
    )
    .with(
      invisible
        ? undefined
        : selector("&:focus")
            .outline(0)
            .zIndex(1)
            .boxShadow((t) => `0 0 0 0.2em ${rgba(t.colors.primary, 0.15)}`),
    )
    .with(
      selector("&:disabled")
        .opacity(0.6)
        .cursor("default"),
    );

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ disabled, invisible, primary, small, block, ...props }: ButtonProps, ref) => {
    return (
      <button
        ref={ref}
        role={"button"}
        css={createBtnStyle({
          invisible,
          primary,
          small,
          block,
        })}
        aria-disabled={disabled}
        disabled={disabled}
        {...props}
      />
    );
  },
);
