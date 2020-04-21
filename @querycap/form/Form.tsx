import { errorMsg } from "@querycap/validators";
import { Dictionary, filter, forEach, get, isArray, isEmpty, isObject, map, mapValues, pickBy } from "lodash";
import React, { createContext, FormHTMLAttributes, useContext, useEffect, useLayoutEffect, useMemo } from "react";
import { formStore } from "./FormStore";

import { FieldState, FormState } from "./State";

const FieldPrefixContext = createContext({ prefix: "" });

export const FieldPrefixProvider = FieldPrefixContext.Provider;

export const useFieldNameMayWithPrefix = (name: string) => {
  const prefix = useContext(FieldPrefixContext).prefix;
  return `${prefix || ""}${name}`;
};

export const pickValidValues = (values: any): any => {
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
};

const validateAll = (fields: FormState["fields"], values: any) => {
  const errors: Dictionary<string> = {};

  forEach(fields, ({ validate }, fieldName) => {
    if (validate) {
      const err = errorMsg(validate(get(values, fieldName)));
      if (err) {
        errors[fieldName] = err;
      }
    }
  });

  return errors;
};

export const useNewFormContext = <TFormValues extends object>(
  formName: string,
  initialValues: Partial<TFormValues>,
) => {
  const [state$, actions] = formStore.useState({ form: formName }, () => ({
    id: "",
    fields: {},
    initials: initialValues,
    values: {},
  }));

  return useMemo(() => {
    const startSubmit = () => {
      return actions.startSubmit(undefined);
    };

    const endSubmit = () => {
      return actions.endSubmit(undefined);
    };

    const setErrors = (errors: Dictionary<string>) => {
      return actions.setErrors(errors);
    };

    const getFormState = () => {
      return (state$ as any).value || ({} as FormState<TFormValues>);
    };

    const addField = (fieldName: string, validate: FieldState["validate"]) => {
      actions.addField({ validate }, { field: fieldName });
    };

    const reset = () => {
      actions.initial(initialValues);
    };

    const destroy = () => {
      actions.destroy(undefined);
    };

    const removeField = (fieldName: string) => {
      actions.removeField(undefined, { field: fieldName });
    };

    const focusField = (fieldName: string) => {
      actions.focusField(undefined, { field: fieldName });
    };

    const blurField = (fieldName: string) => {
      actions.blurField(undefined, { field: fieldName });
    };

    const updateField = (
      fieldName: string,
      nextValue: any | ((value: any) => any),
      error?: string,
      initial?: boolean,
    ) => {
      actions.updateField({ value: nextValue, error, initial }, { field: fieldName });
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

    const validateAndErrors = () => {
      const formState = getFormState();
      return validateAll(formState.fields, formState.values);
    };

    const createSubmit = (cb: (values: TFormValues) => void) => {
      return (e: React.FormEvent) => {
        e.preventDefault();
        e.stopPropagation();

        startSubmit();
        const errors = validateAndErrors();

        if (!isEmpty(errors)) {
          setErrors(errors);
          endSubmit();
          return;
        }

        cb(getValues());
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
      validateAndErrors,

      setErrors,

      createSubmit,

      startSubmit,
      endSubmit,

      destroy,
      reset,

      state$: state$,
    };
  }, [state$, formName]);
};

const FormContext = createContext<{ form: ReturnType<typeof useNewFormContext> }>({} as any);

const FormProvider = FormContext.Provider;

export const useForm = () => useContext(FormContext).form;

const FormInitial = () => {
  const { reset } = useForm();

  // to make sure before autoFocus
  useLayoutEffect(() => {
    reset();
  }, [reset]);

  return null;
};

const FormDestroy = () => {
  const { destroy } = useForm();

  useEffect(() => {
    return () => destroy();
  }, [destroy]);

  return null;
};

export const useNewForm = <TFormValues extends object>(
  formName: string,
  initialValues = {} as Partial<TFormValues>,
) => {
  const ctx = useNewFormContext<TFormValues>(formName, initialValues);

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
};
