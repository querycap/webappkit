import { roundedEm, select, theme } from "@querycap-ui/core/macro";
import { asField, FieldInput, useField } from "@querycap/form";
import { flow } from "lodash";
import React, { ReactNode } from "react";
import { Input, InputProps } from "./Input";

export interface FormControlProps {
  label?: ReactNode;
  error?: ReactNode;
  desc?: ReactNode;
  children?: ReactNode;
}

export const FormControl = ({ label, error, desc, children }: FormControlProps) => {
  return (
    <label
      css={select()
        .display("block")
        .position("relative")
        .paddingY(flow(theme.state.fontSize, roundedEm(1.75)))
        .with(!label && select().paddingTop(0))
        .with(
          select(`& > [role=msg]`)
            .position("absolute")
            .bottom(theme.space.s1)
            .right(0)
            .left(0)
            .paddingY(theme.space.s1)
            .fontSize("0.75em"),
        )}>
      {label && <div css={select().position("absolute").top(0).right(0).left(0)}>{label}</div>}
      {children}
      {error ? (
        <div role={"msg"} css={select().color(theme.colors.danger)}>
          {error}
        </div>
      ) : (
        desc && (
          <div role={"msg"} css={select().opacity(0.5)}>
            {desc}
          </div>
        )
      )}
    </label>
  );
};

export interface FormControlWithFieldProps
  extends Omit<FormControlProps, "error">,
    Omit<InputProps, "active" | "danger"> {
  children: Parameters<typeof FieldInput>[0]["children"];
}

export const FormControlWithField = asField(({ children, label, desc, small, disabled }: FormControlWithFieldProps) => {
  const { state } = useField();

  const err = state.touched ? state.error : undefined;

  return (
    <FormControl error={err} label={label} desc={desc}>
      <Input active={state.active} danger={!!err} disabled={disabled} small={small}>
        <FieldInput>{children}</FieldInput>
      </Input>
    </FormControl>
  );
});
