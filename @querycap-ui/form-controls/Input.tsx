import { select, simpleShadow, theme, tintOrShade, transparentize } from "@querycap-ui/core/macro";
import { FieldMeta } from "@querycap/form";
import { flow } from "lodash";
import React, { ReactNode } from "react";
import { base, fitPaddingY } from "./utils";

export interface ControlledInput<T> extends Partial<FieldMeta> {
  value: T;
  onValueChange: (v: T, initial?: boolean) => void;
}

export interface InputOptions {
  small?: boolean;

  active?: boolean;
  success?: boolean;
  danger?: boolean;

  disabled?: boolean;
}

const paddingX = "0.6em";

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
    .with(select("& > *").paddingY(fitPaddingY(small)))
    .with(
      select("& [role=input]", "& input", "& textarea")
        .flex(1)
        .outline(0)
        .width("100%")
        .maxWidth("100%")
        .background("none")
        .lineHeight("inherit")
        .border("none")
        .colorFill("inherit")
        .paddingX(paddingX),
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
      css={select()
        .paddingX(paddingX)
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
        .paddingX(paddingX)
        .color(flow(theme.state.color, transparentize(0.5)))
        .backgroundColor(flow(theme.state.backgroundColor, tintOrShade(0.06)))
        .borderLeft(`1px solid`)
        .borderColor(theme.state.borderColor)}>
      {children}
    </span>
  );
};

export const InputControlSuffix = ({ children, ...otherProps }: { children?: ReactNode }) => {
  return (
    <span
      {...otherProps}
      css={select().position("relative").display("block").borderLeft(`1px solid`).borderColor(theme.state.borderColor)}>
      {children}
    </span>
  );
};

export const InputControlPrefix = ({ children, ...otherProps }: { children?: ReactNode }) => {
  return (
    <span
      {...otherProps}
      css={select()
        .position("relative")
        .display("block")
        .borderRight(`1px solid`)
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
        .paddingX(paddingX)
        .colorFill(flow(theme.state.color, transparentize(0.5)))
        .backgroundColor(flow(theme.state.color, transparentize(0.97)))
        .cursor("pointer")
        .with(pullRight && select().position("absolute").backgroundColor("transparent").right(0))}>
      {children}
    </span>
  );
};
