import { rgba, selector, themes, tintOrShade } from "@querycap-ui/core";
import React, { ReactNode } from "react";
import { base } from "./utils";

export interface ControlledInput<T> {
  name?: string;
  value: T;
  onValueChange: (v: T) => void;
  disabled?: boolean;
}

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
        .borderColor(themes.state.borderColor)
        .colorFill(themes.state.color)
        .backgroundColor(themes.state.backgroundColor),
    )
    .with(
      active &&
        selector()
          .borderColor(themes.colors.primary)
          .boxShadow((t) => `0 0 0 0.2em ${rgba(t.colors.primary, 0.15)}`),
    )
    .with(
      success &&
        selector()
          .borderColor(themes.colors.success)
          .boxShadow((t) => `0 0 0 0.2em ${rgba(t.colors.success, 0.15)}`),
    )
    .with(
      danger &&
        selector()
          .borderColor(themes.colors.danger)
          .boxShadow((t) => `0 0 0 0.2em ${rgba(t.colors.danger, 0.15)}`),
    )
    .with(
      disabled &&
        selector()
          .opacity(0.5)
          .backgroundColor((t) => tintOrShade(0.1, t.state.backgroundColor))
          .cursor("default"),
    )
    .with(selector("& > *").paddingY((t) => Math.round((small ? 0.25 : 0.5) * t.state.fontSize)))
    .with(
      selector("& input")
        .flex(1)
        .outline(0)
        .background("none")
        .lineHeight("inherit")
        .border("none")
        .colorFill("inherit")
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
        .color((t) => rgba(t.state.color, 0.5))
        .backgroundColor((t) => tintOrShade(0.06, t.state.backgroundColor))
        .borderRight(`1px solid`)
        .borderColor(themes.state.borderColor)}>
      {children}
    </span>
  );
};

export const InputSuffix = ({ children, ...otherProps }: { children?: ReactNode }) => {
  return (
    <span
      {...otherProps}
      css={selector()
        .paddingX(themes.space.s2)
        .color((t) => rgba(t.state.color, 0.5))
        .backgroundColor((t) => tintOrShade(0.06, t.state.backgroundColor))
        .borderLeft(`1px solid`)
        .borderColor(themes.state.borderColor)}>
      {children}
    </span>
  );
};

export const InputIcon = ({ pullRight, children, ...otherProps }: { children?: ReactNode; pullRight?: boolean }) => {
  return (
    <span
      {...otherProps}
      css={selector()
        .display("flex")
        .fill((t) => rgba(t.state.color, 0.5))
        .paddingLeft(themes.space.s2)
        .with(selector("* + &").paddingLeft(0).paddingRight(themes.space.s2))}>
      {children}
    </span>
  );
};
