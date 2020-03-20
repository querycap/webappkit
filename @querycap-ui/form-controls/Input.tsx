import { rgba, selector, themes } from "@querycap-ui/core";
import React, { ReactNode } from "react";
import { base } from "./utils";

export interface InputOptions {
  small?: boolean;
  active?: boolean;
  success?: boolean;
  danger?: boolean;
  disabled?: boolean;
}

const createInputStyle = ({ disabled, active, success, danger, small }: InputOptions) =>
  base
    .display("flex")
    .alignItems("center")
    .outline("none")
    .with(
      selector()
        .borderColor(themes.colors.border)
        .backgroundColor(themes.colors.textLight),
    )
    .with(active && selector().borderColor(themes.colors.primary))
    .with(success && selector().borderColor(themes.colors.success))
    .with(danger && selector().borderColor(themes.colors.danger))
    .with(
      disabled &&
        selector()
          .opacity(0.6)
          .backgroundColor(themes.colors.gray1)
          .cursor("default"),
    )
    .with(selector("& > *").paddingY(small ? "0.25em" : "0.5em"))
    .with(
      selector("& input")
        .flex(1)
        .outline(0)
        .background("none")
        .lineHeight("inherit")
        .border("none")
        .paddingX(themes.space.s2),
    );

export interface InputProps extends InputOptions {
  children?: ReactNode;
}

export const Input = ({ children, disabled, small, active, success, danger, ...props }: InputProps) => {
  return (
    <div
      css={createInputStyle({
        small,
        active,
        danger,
        success,
        disabled,
      })}
      {...props}>
      {children}
    </div>
  );
};

export const InputPrefix = ({ children, ...otherProps }: { children?: ReactNode }) => {
  return (
    <span
      {...otherProps}
      css={selector()
        .paddingX(themes.space.s2)
        .color((t) => rgba(t.colors.text, 0.5))
        .backgroundColor(themes.colors.gray1)
        .borderRight(`1px solid`)
        .borderColor(themes.colors.border)}>
      {children}
    </span>
  );
};

export const InputIcon = ({ pullRight, children, ...otherProps }: { children?: ReactNode; pullRight?: boolean }) => {
  return (
    <span
      {...otherProps}
      css={selector()
        .fill((t) => rgba(t.colors.text, 0.5))
        .paddingLeft(themes.space.s2)
        .with(
          selector("* + &")
            .paddingLeft(0)
            .paddingRight(themes.space.s2),
        )}>
      {children}
    </span>
  );
};
