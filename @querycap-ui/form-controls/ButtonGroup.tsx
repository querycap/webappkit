import { selector } from "@querycap-ui/core";
import React, { Children, cloneElement, isValidElement, ReactNode } from "react";
import { themes } from "@querycap-ui/core";

export const ButtonGroup = ({ small, children }: { small?: boolean; children?: ReactNode }) => {
  return (
    <div
      css={selector()
        .with(selector("& > [role=button]").borderRadius(0))
        .with(selector("& > [role=button]:first-of-type").borderLeftRadius(themes.radii.s))
        .with(selector("& > [role=button]:last-of-type").borderRightRadius(themes.radii.s))
        .with(selector("& > [role=button] + [role=button]").marginLeft(-1))}>
      {Children.map(children, (e) => {
        if (isValidElement(e)) {
          return cloneElement(e, { small: small });
        }
        return null;
      })}
    </div>
  );
};
