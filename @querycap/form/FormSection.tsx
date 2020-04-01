import React, { ReactNode } from "react";
import { FieldPrefixProvider, useFieldNameMayWithPrefix } from "./Form";

export interface IFormSection {
  name: string;
  children: ReactNode;
}

export const FormSection = ({ name, children }: IFormSection) => {
  const prefix = useFieldNameMayWithPrefix(`${name}.`);

  return (
    <FieldPrefixProvider
      value={{
        prefix,
      }}>
      {children}
    </FieldPrefixProvider>
  );
};
