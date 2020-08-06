import { useValueRef } from "@querycap/reactutils";
import { errorMsg, Validator } from "@querycap/validators";
import { useSelector } from "@reactorx/core";
import { get, noop, isUndefined } from "lodash";
import React, {
  createContext,
  FunctionComponent,
  InputHTMLAttributes,
  ReactNode,
  useContext,
  useLayoutEffect,
  useMemo,
} from "react";
import { useFieldNameMayWithPrefix, useForm } from "./Form";
import { FieldState } from "./State";

export interface FieldMeta {
  name: string;
  readOnly?: boolean;
  disabled?: boolean;
}

export interface FieldProps extends Partial<FieldMeta> {
  validate?: Validator;
  children: ReactNode;
}

export interface CurrentFieldContext<T = any> extends FieldMeta {
  value: any;
  state: FieldState;
  controls: {
    handleValueChange: (v: T, initial?: boolean) => void;
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

export const useFieldState = (name: string): { formID: string; name: string; value: any; state: FieldState } => {
  const { state$ } = useForm();

  return useSelector(
    state$,
    (state) => {
      const formID = state.id;
      const fieldState = get(state, ["fields", name]);

      return {
        state: fieldState || {},
        value: get(state, `values.${name}`),
        name,
        formID,
      };
    },
    [name],
  );
};

const FieldRegister = ({ name, validate }: { name: string; validate: FieldState["validate"] }) => {
  const { formName, addField, removeField } = useForm();

  useLayoutEffect(() => {
    addField(name, validate);
    return () => removeField(name);
  }, [formName, name]);

  return null;
};

export const Field = ({ name: n, validate: v, disabled, readOnly, children }: FieldProps) => {
  const { formName, updateField, focusField, blurField } = useForm();

  const name = useFieldNameMayWithPrefix(n || "");

  const validateRef = useValueRef(v || (() => ""));

  const validate: Validator = (value: any): any => {
    return validateRef.current(value);
  };

  const controls = useMemo(() => {
    return {
      handleValueChange: (value: any, initial?: boolean) => {
        updateField(name, value, errorMsg(validate(value)), initial);
      },
      handleFocus: () => focusField(name),
      handleBlur: () => blurField(name),
    };
  }, [formName, name]);

  const fieldState = useFieldState(name);

  if(!fieldState.formID) {
    return null;
  }

  return (
    <FieldProvider
      key={`${fieldState.formID}/${fieldState.name}`}
      value={{ ...fieldState, disabled, readOnly, controls }}>
      <FieldRegister name={name} validate={validate} />
      {children}
    </FieldProvider>
  );
};

export const asField = <TProps extends {}>(Comp: FunctionComponent<TProps>) => {
  return ({ name, validate, readOnly, disabled, ...props }: TProps & Omit<FieldProps, "children">) => {
    return (
      <Field name={name} readOnly={readOnly} disabled={disabled} validate={validate}>
        <Comp {...(props as any)} />
      </Field>
    );
  };
};

export interface FieldInputCommonProps<T = any> extends FieldMeta {
  value: T;
  onValueChange: (v: T, initial?: boolean) => void;
  onFocus: () => void;
  onBlur: () => void;
}

export const FieldInput = ({ children }: { children: (props: FieldInputCommonProps) => JSX.Element | number }) => {
  const { name, readOnly, disabled, value, controls } = useField();

  return (
    <>
      {children({
        name,
        readOnly,
        disabled,
        value: isUndefined(value) ? "" : value,
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
