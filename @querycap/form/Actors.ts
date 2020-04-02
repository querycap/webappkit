import { Actor } from "@reactorx/core";
import { cloneDeep, Dictionary, get, isFunction, mapValues, omit, set } from "lodash";
import { FieldState, FormErrors, FormState } from "./State";

export const FormActor = Actor.of<any, { form: string }>("form");

export const formKey = (formName: string) => `${FormActor.group}::${formName}`;

const formKeyFromActor = (actor: Actor) => formKey(actor.opts.form);

export const formInitial = FormActor.named<{ initials: any; id: string }>("initial").effectOn(
  formKeyFromActor,
  (_, { arg }) => ({
    id: arg.id,
    fields: {},
    initials: arg.initials,
    values: cloneDeep(arg),
  }),
);

export const formDestroy = FormActor.named<void>("destroy").effectOn(formKeyFromActor, () => undefined);

const mustFormStateReady = <T extends Actor>(reducer: (formState: FormState, actor: T) => FormState) => (
  formState: FormState,
  actor: T,
) => (formState ? reducer(formState, actor) : undefined);

export const formStartSubmit = FormActor.named<void>("start-submit").effectOn(
  formKeyFromActor,
  mustFormStateReady((formState: FormState) => ({
    ...formState,
    fields: mapValues(formState.fields, (field) => ({
      ...field,
      visited: true,
      touched: true,
    })),
    submitting: true,
  })),
);

export const formEndSubmit = FormActor.named<void>("end-submit").effectOn(
  formKeyFromActor,
  mustFormStateReady((formState: FormState) => ({ ...formState, submitting: false })),
);

export const formSetErrors = FormActor.named<FormErrors>("set-errors").effectOn(
  formKeyFromActor,
  mustFormStateReady((formState: FormState, { arg = {} }) => ({
    ...formState,
    fields: mapValues(formState.fields, (fieldState, key) => ({
      ...fieldState,
      error: arg[key || ""],
    })),
  })),
);

const putValues = (values: any = {}, fieldName: string, value: string): any => {
  set(values, fieldName, value);
  return values;
};

const putFields = (
  fields: Dictionary<FieldState>,
  fieldName: string,
  effect: (fieldState: FieldState) => FieldState,
): Dictionary<FieldState> => {
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
};

export const formAddField = FormActor.named<{ defaultValue: any; error?: string }, { field: string }>(
  "field/add",
).effectOn(
  formKeyFromActor,
  mustFormStateReady((formState: FormState, { arg: { defaultValue, error }, opts }) => ({
    ...formState,
    values: putValues(formState.values, opts.field, get(formState.initials, opts.field, defaultValue)),
    fields: putFields(formState.fields, opts.field, () => ({
      error,
      active: false,
      changed: false,
      touched: false,
      visited: false,
    })),
  })),
);

export const formUpdateField = FormActor.named<
  { value: any | ((value: any) => any); error?: string; initial?: boolean },
  { field: string }
>("field/update").effectOn(
  formKeyFromActor,
  mustFormStateReady((formState: FormState, { arg: { error, value, initial }, opts }) => ({
    ...formState,
    values: putValues(
      formState.values,
      opts.field,
      isFunction(value) ? value(get(formState, `values.${opts.field}`)) : value,
    ),
    fields: putFields(formState.fields, opts.field, (fieldState) => ({
      ...fieldState,
      changed: !initial,
      error,
    })),
  })),
);

export const formRemoveField = FormActor.named<void, { field: string }>("field/remove").effectOn(
  formKeyFromActor,
  mustFormStateReady((formState: FormState, { opts }) => ({
    ...formState,
    fields: putFields(formState.fields, opts.field, () => undefined as any),
  })),
);

export const formFocusField = FormActor.named<void, { field: string }>("field/focus").effectOn(
  formKeyFromActor,
  mustFormStateReady((formState: FormState, { opts }) => ({
    ...formState,
    fields: putFields(formState.fields, opts.field, (fieldState) => ({
      ...fieldState,
      active: true,
      visited: true,
    })),
  })),
);

export const formBlurField = FormActor.named<void, { field: string }>("field/blur").effectOn(
  formKeyFromActor,
  mustFormStateReady((formState: FormState, { opts }) => ({
    ...formState,
    fields: putFields(formState.fields, opts.field, (fieldState) => ({
      ...fieldState,
      active: false,
      touched: true,
    })),
  })),
);
