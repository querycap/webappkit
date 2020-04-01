import { roundedEm, select, simpleShadow, theme, tintOrShade, transparentize } from "@querycap-ui/core/macro";
import { flow } from "lodash";
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
  select()
    .with(base)
    .display("flex")
    .alignItems("center")
    .outline("none")
    .with(
      select()
        .borderColor(theme.state.borderColor)
        .colorFill(theme.state.color)
        .backgroundColor(theme.state.backgroundColor),
    )
    .with(
      active &&
        select()
          .borderColor(theme.colors.primary)
          .boxShadow(flow(theme.colors.primary, transparentize(0.85), simpleShadow("0 0 0 0.2em"))),
    )
    .with(
      success &&
        select()
          .borderColor(theme.colors.success)
          .boxShadow(flow(theme.colors.success, transparentize(0.85), simpleShadow("0 0 0 0.2em"))),
    )
    .with(
      danger &&
        select()
          .borderColor(theme.colors.danger)
          .boxShadow(flow(theme.colors.danger, transparentize(0.85), simpleShadow("0 0 0 0.2em"))),
    )
    .with(
      disabled &&
        select()
          .opacity(0.5)
          .cursor("default")
          .backgroundColor(flow(theme.state.backgroundColor, tintOrShade(0.1))),
    )
    .with(select("& > *").paddingY(flow(theme.state.fontSize, roundedEm(small ? 0.25 : 0.5))))
    .with(
      select("& input", "& textarea")
        .flex(1)
        .outline(0)
        .background("none")
        .lineHeight("inherit")
        .border("none")
        .colorFill("inherit")
        .paddingX(theme.space.s2),
    )
    .with(select(`& * + input`).marginLeft("-2em").paddingLeft("2em"))
    .with(select("& input:not(:last-child)").marginRight("-2em").paddingRight("2em"));

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
      css={select()
        .paddingX(theme.space.s2)
        .marginRight(theme.space.s2)
        .color(flow(theme.state.color, transparentize(0.5)))
        .backgroundColor(flow(theme.state.backgroundColor, tintOrShade(0.06)))
        .borderRight(`1px solid`)
        .borderColor(theme.state.borderColor)}>
      {children}
    </span>
  );
};

export const InputSuffix = ({ children, ...otherProps }: { children?: ReactNode }) => {
  return (
    <span
      {...otherProps}
      css={select()
        .paddingX(theme.space.s2)
        .marginLeft(theme.space.s2)
        .color(flow(theme.state.color, transparentize(0.5)))
        .backgroundColor(flow(theme.state.backgroundColor, tintOrShade(0.06)))
        .borderLeft(`1px solid`)
        .borderColor(theme.state.borderColor)}>
      {children}
    </span>
  );
};

export const InputIcon = ({ pullRight, children, ...otherProps }: { children?: ReactNode; pullRight?: boolean }) => {
  return (
    <span
      {...otherProps}
      role="img"
      css={select()
        .textAlign("center")
        .width("2em")
        .colorFill(flow(theme.state.color, transparentize(0.5)))}>
      {children}
    </span>
  );
};
