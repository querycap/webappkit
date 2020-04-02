import { useStore, Volume } from "@reactorx/core";
import { Dictionary, every, filter, get, isArray, isObject, map, mapValues, pickBy } from "lodash";
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
import { v4 as uuid } from "uuid";
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

  initial: () => void;
  destroy: () => void;
  reset: () => void;

  addField: (fieldName: string) => void;
  removeField: (fieldName: string) => void;

  updateField: (fieldName: string, value: any | ((value: any) => any), error?: string, initial?: boolean) => void;
  focusField: (fieldName: string) => void;
  blurField: (fieldName: string) => void;

  setErrors: (errors: Dictionary<string>) => void;

  getErrors: () => Dictionary<string>;
  getValues: () => TFormValues;

  createSubmit: (cb: (values: TFormValues) => void) => (evt: SyntheticEvent<any>) => void;
  startSubmit: () => void;
  endSubmit: () => void;

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

const FormInitial = () => {
  const { initial, formName } = useForm();

  // to make sure before autoFocus
  useLayoutEffect(() => {
    initial();
  }, [formName]);

  return null;
};

const FormDestroy = () => {
  const { destroy, formName } = useForm();

  useEffect(() => {
    return () => destroy();
  }, [formName]);

  return null;
};

export function useNewForm<TFormValues extends object>(formName: string, initialValues = {} as Partial<TFormValues>) {
  const store$ = useStore();

  const ctx = useMemo(() => {
    const formState = {
      id: uuid(),
      initials: initialValues,
      values: initialValues,
    };

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

    const initial = () => {
      formInitial.with({ initials: formState.initials, id: formState.id }, { form: formName }).invoke(store$);
    };

    const destroy = () => {
      formDestroy.with(undefined, { form: formName }).invoke(store$);
    };

    const reset = () => {
      formState.id = uuid();

      destroy();
      initial();
    };

    const removeField = (fieldName: string) => {
      formRemoveField.with(undefined, { form: formName, field: fieldName }).invoke(store$);
    };

    const focusField = (fieldName: string) => {
      formFocusField.with(undefined, { form: formName, field: fieldName }).invoke(store$);
    };

    const blurField = (fieldName: string) => {
      formBlurField.with(undefined, { form: formName, field: fieldName }).invoke(store$);
    };

    const updateField = (
      fieldName: string,
      nextValue: any | ((value: any) => any),
      error?: string,
      initial?: boolean,
    ) => {
      formUpdateField
        .with(
          {
            value: nextValue,
            error,
            initial,
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

    const getErrors = () => {
      return pickBy(
        mapValues(getFormState().fields, (f) => f.error),
        (v) => v,
      );
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

      addField,
      removeField,

      updateField,
      focusField,
      blurField,

      getValues,
      getErrors,

      setErrors,

      createSubmit,

      startSubmit,
      endSubmit,

      initial,
      destroy,

      reset,

      state$: Volume.from(store$, (state) => get(state, formKey(formName), formState)),
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
          <FormInitial />
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
          <FormDestroy />
        </FormProvider>
      );
    };
  }, [ctx]);

  return [ctx, Form] as const;
}
