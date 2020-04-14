import { createStore } from "@querycap/contexts";
import { cloneDeep, Dictionary, get, isFunction, mapValues, omit, set } from "lodash";
import { v4 as uuid } from "uuid";
import { FieldState, FormErrors, FormState } from "./State";

const mustReady = (next: (formState: FormState) => FormState) => (formState: FormState) =>
  formState ? next(formState) : undefined;

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

export interface FormOpt {
  form: string;
}

export interface FieldOpt {
  field: string;
}

export const formStore = createStore<FormOpt, FormState>({
  group: "form",
  storageKey: ({ group, form }) => `${group}:${form}`,
})({
  initial: (initials: any = {}) => () => ({
    id: uuid(),
    fields: {},
    initials: initials,
    values: cloneDeep(initials),
  }),
  destroy: () => () => undefined,
  startSubmit: () =>
    mustReady((formState) => ({
      ...formState,
      fields: mapValues(formState.fields, (field) => ({
        ...field,
        visited: true,
        touched: true,
      })),
      submitting: true,
    })),
  endSubmit: () => mustReady((formState) => ({ ...formState, submitting: false })),
  setErrors: (arg: FormErrors = {}) =>
    mustReady((formState) => ({
      ...formState,
      fields: mapValues(formState.fields, (fieldState, key) => ({
        ...fieldState,
        error: arg[key || ""],
      })),
    })),
  addField: ({ defaultValue, validate }: { defaultValue?: any; validate: FieldState["validate"] }, opts: FieldOpt) =>
    mustReady((formState) => {
      return {
        ...formState,
        values: putValues(formState.values, opts.field, get(formState.initials, opts.field, defaultValue)),
        fields: putFields(formState.fields, opts.field, () => ({
          validate,
          active: false,
          changed: false,
          touched: false,
          visited: false,
        })),
      };
    }),

  updateField: (
    { error, value, initial }: { value: any | ((value: any) => any); error?: string; initial?: boolean },
    opts: FieldOpt,
  ) =>
    mustReady((formState) => ({
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

  removeField: (_: undefined, opts: FieldOpt) =>
    mustReady((formState) => ({
      ...formState,
      fields: putFields(formState.fields, opts.field, () => undefined as any),
    })),

  focusField: (_: undefined, opts: FieldOpt) =>
    mustReady((formState) => ({
      ...formState,
      fields: putFields(formState.fields, opts.field, (fieldState) => ({
        ...fieldState,
        active: true,
        visited: true,
      })),
    })),

  blurField: (_: undefined, opts: FieldOpt) =>
    mustReady((formState) => ({
      ...formState,
      fields: putFields(formState.fields, opts.field, (fieldState) => ({
        ...fieldState,
        active: false,
        touched: true,
      })),
    })),
});
