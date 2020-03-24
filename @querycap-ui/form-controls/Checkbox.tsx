import { selector, themes } from "@querycap-ui/core";
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
          css={selector()
            .fill(disabled ? themes.state.borderColor : themes.colors.primary)
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
        {children && <span css={selector().flex(1).marginLeft(themes.space.s2)}>{children}</span>}
      </label>
    );
  },
);
