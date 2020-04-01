import { useValueRef } from "@querycap/reactutils";
import { useSelector } from "@reactorx/core";
import { get, noop } from "lodash";
import React, {
  createContext,
  FunctionComponent,
  InputHTMLAttributes,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useFieldNameMayWithPrefix, useForm } from "./Form";
import { FieldState, Validate } from "./State";

export interface FieldProps<TName extends string = string> {
  name?: TName;
  children: ReactNode;
  validate?: Validate;
}

export interface CurrentFieldContext<T = any> {
  name: string;
  value: any;
  state: FieldState;
  controls: {
    handleValueChange: (v: T) => void;
    handleBlur: (e?: FocusEvent) => void;
    handleFocus: (e?: FocusEvent) => void;
  };
}

const FieldContext = createContext<CurrentFieldContext>({
  name: "",
  value: undefined,
  state: {},
  controls: {} as any,
});

const FieldProvider = FieldContext.Provider;

export const useField = () => useContext(FieldContext);

export const useFieldState = (name: string): { name: string; value: any; state: FieldState } => {
  const { state$ } = useForm();

  return useSelector(
    state$,
    (state) => ({
      state: get(state, ["fields", name], {}),
      value: get(state, `values.${name}`),
      name,
    }),
    [name],
  );
};

export const Field = <TName extends string = string>(props: FieldProps<TName>) => {
  const { formName, registerField, updateField, focusField, blurField } = useForm();

  const name = useFieldNameMayWithPrefix(props.name || "");
  const validateRef = useValueRef(props.validate || (() => ""));

  useEffect(() => {
    return registerField(name);
  }, [formName, name]);

  const controls = useMemo(() => {
    return {
      handleValueChange: (value: any) => {
        updateField(name, value, validateRef.current(value));
      },
      handleFocus: () => focusField(name),
      handleBlur: () => blurField(name),
    };
  }, [formName, name]);

  const { value, state } = useFieldState(name);

  return <FieldProvider value={{ name, value, state, controls }}>{props.children}</FieldProvider>;
};

export const asField = <TProps extends {}>(Comp: FunctionComponent<TProps>) => {
  return ({ name, validate, ...props }: TProps & Omit<FieldProps, "children">) => {
    return (
      <Field name={name} validate={validate}>
        <Comp {...(props as any)} />
      </Field>
    );
  };
};

export interface FieldInputCommonProps<T = any> {
  name: string;
  value: T;
  onValueChange: (v: T) => void;
  onFocus: () => void;
  onBlur: () => void;
}

export const FieldInput = ({ children }: { children: (props: FieldInputCommonProps) => JSX.Element | number }) => {
  const { name, value, controls } = useField();

  return (
    <>
      {children({
        name,
        value: value || "",
        onValueChange: controls.handleValueChange || noop,
        onFocus: controls.handleFocus,
        onBlur: controls.handleBlur,
      })}
    </>
  );
};

interface SimpleInputTextProps
  extends FieldInputCommonProps<string>,
    Omit<InputHTMLAttributes<HTMLInputElement>, keyof FieldInputCommonProps<string>> {}

export const SimpleInputText = ({ onValueChange, ...props }: SimpleInputTextProps) => (
  <input {...props} onChange={(e) => onValueChange(e.target.value)} />
);
