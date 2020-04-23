import { roundedEm, select, theme } from "@querycap-ui/core/macro";
import { Stack } from "@querycap-ui/layouts";
import { asField, FieldInput, useField } from "@querycap/form";
import React, { ReactNode } from "react";
import { Input, InputProps } from "./Input";

export interface FormControlProps {
  label?: ReactNode;
  error?: ReactNode;
  desc?: ReactNode;
  children?: ReactNode;
}

export const FormControls = ({ children, ...otherProps }: { children: ReactNode }) => {
  return (
    <Stack {...otherProps} inline spacing={roundedEm(0.6)} css={select().marginTop(roundedEm(1.2))}>
      {children}
    </Stack>
  );
};

export const FormControl = ({ label, error, desc, children }: FormControlProps) => {
  return (
    <label
      css={select()
        .display("block")
        .position("relative")
        .paddingY(roundedEm(1.8))
        .with(!label && select().paddingTop(0))}>
      <div
        css={select()
          .position("relative")
          .with(
            select("& > [role=label]")
              .position("absolute")
              .opacity(0.5)
              .fontSize(roundedEm(0.9))
              .bottom("100%")
              .paddingY(3)
              .right(0)
              .left(0),
          )
          .with(
            select(`& > [role=msg]`)
              .paddingY(3)
              .position("absolute")
              .top("100%")
              .right(0)
              .left(0)
              .fontSize(roundedEm(0.75)),
          )}>
        {label && <div role={"label"}>{label}</div>}
        {children}
        {error ? (
          <div role={"msg"} css={select().color(theme.colors.danger)}>
            {error}
          </div>
        ) : (
          desc && (
            <div role={"msg"} css={select().opacity(0.4)}>
              {desc}
            </div>
          )
        )}
      </div>
    </label>
  );
};

export interface FormControlWithFieldProps extends Omit<FormControlProps, "error">, Pick<InputProps, "small"> {
  children: Parameters<typeof FieldInput>[0]["children"];
}

export const FormControlWithField = asField(({ children, label, desc, small }: FormControlWithFieldProps) => {
  const { state, disabled } = useField();

  const err = state.touched ? state.error : undefined;

  return (
    <FormControl error={err} label={label} desc={desc}>
      <Input active={state.active} danger={!!err} disabled={disabled} small={small}>
        <FieldInput>{children}</FieldInput>
      </Input>
    </FormControl>
  );
});
