import { useStore, Volume } from "@reactorx/core";
import { Dictionary, every, filter, get, isArray, isObject, map, mapValues } from "lodash";
import React, {
  createContext,
  FormHTMLAttributes,
  SyntheticEvent,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
} from "react";
import { Observable } from "rxjs";
import {
  formAddField,
  formBlurField,
  formDestroy,
  formEndSubmit,
  formFocusField,
  formInitial,
  formKey,
  formRemoveField,
  formSetErrors,
  formStartSubmit,
  formUpdateField,
} from "./Actors";
import { FieldState, FormState } from "./State";

const FieldPrefixContext = createContext({ prefix: "" });

export const FieldPrefixProvider = FieldPrefixContext.Provider;

export const useFieldNameMayWithPrefix = (name: string) => {
  const prefix = useContext(FieldPrefixContext).prefix;
  return `${prefix || ""}${name}`;
};

export interface FormContexts<TFormValues = any> {
  formName: string;

  registerField: (fieldName: string) => () => void;

  updateField: (fieldName: string, value: any | ((value: any) => any), error?: string) => void;
  focusField: (fieldName: string) => void;
  blurField: (fieldName: string) => void;

  setErrors: (errors: Dictionary<string>) => void;
  getValues: () => TFormValues;

  createSubmit: (cb: (values: TFormValues) => void) => (evt: SyntheticEvent<any>) => void;
  startSubmit: () => void;
  endSubmit: () => void;

  reset: () => void;

  state$: Observable<FormState<TFormValues>>;
}

const FormContext = createContext<{ form: FormContexts<any> }>({} as any);

const FormProvider = FormContext.Provider;

export function useForm<TFormValues extends any>(): FormContexts<TFormValues> {
  return useContext(FormContext).form;
}

const isValid = (fields: FormState["fields"]): boolean => {
  return every(fields || {}, (field: FieldState) => !field.error);
};

export function pickValidValues(values: any): any {
  if (values instanceof Blob || values instanceof File) {
    return values;
  }

  if (isArray(values)) {
    return map(
      filter(values, (item) => item != null),
      pickValidValues,
    );
  }

  if (isObject(values)) {
    return mapValues(values, pickValidValues);
  }

  return values;
}

const FormMount = ({ formName, initialValues }: { formName: string; initialValues: any }) => {
  const store$ = useStore();

  // to make sure before autoFocus
  useLayoutEffect(() => {
    formInitial.with(initialValues, { form: formName }).invoke(store$);
  }, [formName]);

  return null;
};

const FormUnmount = ({ formName }: { formName: string }) => {
  const store$ = useStore();

  useEffect(() => {
    return () => {
      formDestroy.with(undefined, { form: formName }).invoke(store$);
    };
  }, [formName]);

  return null;
};

export function useNewForm<TFormValues extends object>(formName: string, initialValues = {} as Partial<TFormValues>) {
  const store$ = useStore();

  const ctx = useMemo(() => {
    const startSubmit = () => {
      return formStartSubmit.with(undefined, { form: formName }).invoke(store$);
    };

    const endSubmit = () => {
      return formEndSubmit.with(undefined, { form: formName }).invoke(store$);
    };

    const setErrors = (errors: Dictionary<string>) => {
      return formSetErrors.with(errors, { form: formName }).invoke(store$);
    };

    const getFormState = () => {
      return store$.getState()[formKey(formName)] || ({} as FormState<TFormValues>);
    };

    const addField = (fieldName: string, defaultValue?: string) => {
      formAddField
        .with(
          {
            defaultValue: defaultValue,
          },
          { form: formName, field: fieldName },
        )
        .invoke(store$);
    };

    const reset = () => {
      formDestroy.with(undefined, { form: formName }).invoke(store$);
      formInitial.with(initialValues, { form: formName }).invoke(store$);
    };

    const removeField = (fieldName: string) => {
      formRemoveField.with(undefined, { form: formName, field: fieldName }).invoke(store$);
    };

    const registerField = (fieldName: string, defaultValue?: string) => {
      addField(fieldName, defaultValue);

      return () => {
        removeField(fieldName);
      };
    };

    const focusField = (fieldName: string) => {
      formFocusField.with(undefined, { form: formName, field: fieldName }).invoke(store$);
    };

    const blurField = (fieldName: string) => {
      formBlurField.with(undefined, { form: formName, field: fieldName }).invoke(store$);
    };

    const updateField = (fieldName: string, nextValue: any | ((value: any) => any), error?: string) => {
      formUpdateField
        .with(
          {
            value: nextValue,
            error: error,
          },
          {
            field: fieldName,
            form: formName,
          },
        )
        .invoke(store$);
    };

    const getValues = () => {
      return getFormState().values;
    };

    const createSubmit = (cb: (values: TFormValues) => void) => {
      return (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        startSubmit();

        const formState = getFormState();

        if (!isValid(formState.fields)) {
          endSubmit();
          return;
        }

        cb(formState.values);
      };
    };

    return {
      formName,

      registerField,
      updateField,
      focusField,
      blurField,

      getValues,
      setErrors,

      createSubmit,

      startSubmit,
      endSubmit,

      reset,

      state$: Volume.from(store$, (state) => get(state, formKey(formName), { values: initialValues })),
    };
  }, [store$, formName]);

  const Form = useMemo(() => {
    return function Form({
      onSubmit,
      children,
      ...otherProps
    }: {
      onSubmit?: (values: TFormValues, end: () => void) => void;
    } & Omit<FormHTMLAttributes<any>, "onSubmit">) {
      return (
        <FormProvider key={formName} value={{ form: ctx }}>
          <FormMount formName={formName} initialValues={initialValues} />
          <form
            noValidate
            onSubmit={ctx.createSubmit((values) => {
              if (onSubmit) {
                onSubmit(values, () => {
                  ctx.endSubmit();
                });
              }
            })}
            {...otherProps}>
            {children}
          </form>
          <FormUnmount formName={formName} />
        </FormProvider>
      );
    };
  }, [ctx]);

  return [ctx, Form] as const;
}
