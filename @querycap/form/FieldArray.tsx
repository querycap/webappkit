import { filter, last, map } from "lodash";
import React, { ReactNode } from "react";
import { useFieldState } from "./Field";
import { FieldPrefixProvider, useFieldNameMayWithPrefix, useForm } from "./Form";

export interface FieldArrayHelpers {
  add: (defaultValue?: any) => void;
  remove: (idx: number) => void;
  update: (cb: (values: any[]) => any[]) => void;
  each: (render: (idx: number) => ReactNode) => ReactNode;
}

export interface FieldArrayProps {
  name: string;
  defaultValues?: any[];
  children: (helpers: FieldArrayHelpers) => ReactNode;
}

export const FieldArray = ({ defaultValues = [], name, children }: FieldArrayProps) => {
  const { updateField } = useForm();
  const fieldName = useFieldNameMayWithPrefix(name);

  const { value: values } = useFieldState(fieldName);

  const helpers = {
    update(cb: (values: any[]) => any[]) {
      updateField(fieldName, (values: any[] = []) => cb(values));
    },
    add(defaultValue?: any) {
      updateField(fieldName, (values: any[] = []) => {
        if (last(values) || values.length === 0) {
          return [...values, defaultValue];
        }
        return values;
      });
    },
    remove(idx: number) {
      updateField(fieldName, (values: any[] = []) => filter(values, (_, i: number) => i !== idx));
    },
    each(render: (idx: number) => React.ReactNode) {
      return (
        <>
          {map(values || defaultValues, (_, i: number) => (
            <FieldPrefixProvider
              key={i}
              value={{
                prefix: `${fieldName}[${i}]`,
              }}>
              {render(i)}
            </FieldPrefixProvider>
          ))}
        </>
      );
    },
  };

  return <>{children(helpers)}</>;
};
