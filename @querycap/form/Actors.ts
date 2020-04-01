import { Actor } from "@reactorx/core";
import { cloneDeep, Dictionary, get, isFunction, mapValues, omit, set } from "lodash";
import { FieldState, FormErrors, FormState } from "./State";

export const FormActor = Actor.of<any, { form: string }>("form");

export const formKey = (formName: string) => `${FormActor.group}::${formName}`;

const formKeyFromActor = (actor: Actor) => formKey(actor.opts.form);

export const formInitial = FormActor.named<any>("initial").effectOn(formKeyFromActor, (_, { arg }) => ({
  fields: {},
  initials: arg,
  values: cloneDeep(arg),
}));

export const formDestroy = FormActor.named<void>("destroy").effectOn(formKeyFromActor, () => undefined);

export const formStartSubmit = FormActor.named<void>("start-submit").effectOn(
  formKeyFromActor,
  (formState: FormState) => ({
    ...formState,
    fields: mapValues(formState.fields, (field) => ({
      ...field,
      visited: true,
      touched: true,
    })),
    submitting: true,
  }),
);

export const formEndSubmit = FormActor.named<void>("end-submit").effectOn(formKeyFromActor, (formState: FormState) =>
  formState ? { ...formState, submitting: false } : undefined,
);

export const formSetErrors = FormActor.named<FormErrors>("set-errors").effectOn(
  formKeyFromActor,
  (formState: FormState, { arg = {} }) => ({
    ...formState,
    fields: mapValues(formState.fields, (fieldState, key) => ({
      ...fieldState,
      error: arg[key || ""],
    })),
  }),
);

export const formAddField = FormActor.named<{ defaultValue: any; error?: string }, { field: string }>(
  "field/add",
).effectOn(formKeyFromActor, (formState: FormState, { arg: { defaultValue, error }, opts }) => ({
  ...formState,
  values: putValues(formState.values, opts.field, get(formState.initials, opts.field, defaultValue)),
  fields: putFields(formState.fields, opts.field, () => ({
    error,
    active: false,
    changed: false,
    touched: false,
    visited: false,
  })),
}));

export const formUpdateField = FormActor.named<
  { value: any | ((value: any) => any); error?: string },
  { field: string }
>("field/update").effectOn(formKeyFromActor, (formState: FormState, { arg: { error, value }, opts }) => ({
  ...formState,
  values: putValues(
    formState.values,
    opts.field,
    isFunction(value) ? value(get(formState, `values.${opts.field}`)) : value,
  ),
  fields: putFields(formState.fields, opts.field, (fieldState) => ({
    ...fieldState,
    changed: true,
    error,
  })),
}));

export const formRemoveField = FormActor.named<void, { field: string }>("field/remove").effectOn(
  formKeyFromActor,
  (formState: FormState, { opts }) => ({
    ...formState,
    fields: putFields(formState.fields, opts.field, () => undefined as any),
  }),
);

export const formFocusField = FormActor.named<void, { field: string }>("field/focus").effectOn(
  formKeyFromActor,
  (formState: FormState, { opts }) => ({
    ...formState,
    fields: putFields(formState.fields, opts.field, (fieldState) => ({
      ...fieldState,
      active: true,
      visited: true,
    })),
  }),
);

export const formBlurField = FormActor.named<void, { field: string }>("field/blur").effectOn(
  formKeyFromActor,
  (formState: FormState, { opts }) => ({
    ...formState,
    fields: putFields(formState.fields, opts.field, (fieldState) => ({
      ...fieldState,
      active: false,
      touched: true,
    })),
  }),
);

export function putValues(values: any = {}, fieldName: string, value: string): any {
  set(values, fieldName, value);
  return values;
}

export function putFields(
  fields: Dictionary<FieldState>,
  fieldName: string,
  effect: (fieldState: FieldState) => FieldState,
): Dictionary<FieldState> {
  const fieldState = fields[fieldName] || ({} as FieldState);
  const nextFieldState = effect(fieldState);

  if (nextFieldState) {
    return {
      ...fields,
      [fieldName]: {
        name: fieldName,
        ...fieldState,
        ...nextFieldState,
      },
    };
  }

  return omit<FieldState>(fields, fieldName) as Dictionary<FieldState>;
}
