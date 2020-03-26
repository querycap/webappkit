import { select, theme } from "@querycap-ui/core/macro";
import { IconCheckSquare, IconMinusSquare, IconSquare } from "@querycap-ui/icons";
import React, { forwardRef, ReactNode } from "react";
import { ControlledInput } from "./Input";

export interface CheckboxProps extends ControlledInput<boolean> {
  indeterminate?: boolean;
  children?: ReactNode;
}

export const Checkbox = forwardRef(
  ({ name, value, onValueChange, disabled, indeterminate, children, ...props }: CheckboxProps, ref) => {
    return (
      <label {...props} role="switch" aria-checked={value} css={{ display: "block" }}>
        <input
          ref={ref as any}
          name={name}
          style={{ display: "none" }}
          type="checkbox"
          value={value as any}
          disabled={disabled}
          onChange={() => !disabled && onValueChange(!value)}
        />
        <span
          css={select()
            .fill(disabled ? theme.state.borderColor : theme.colors.primary)
            .cursor(disabled ? "default" : "pointer")}>
          {value ? (
            indeterminate ? (
              <IconMinusSquare scale={1.2} />
            ) : (
              <IconCheckSquare scale={1.2} />
            )
          ) : (
            <IconSquare scale={1.2} />
          )}
        </span>
        {children && <span css={select().flex(1).marginLeft(theme.space.s2)}>{children}</span>}
      </label>
    );
  },
);
