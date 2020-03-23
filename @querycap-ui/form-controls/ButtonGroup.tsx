import { selector } from "@querycap-ui/core";
import React, { Children, cloneElement, isValidElement, ReactNode } from "react";

export const ButtonGroup = ({ small, children }: { small?: boolean; children?: ReactNode }) => {
  return (
    <div
      css={selector()
        .with(selector("& > [role=button]:first-of-type").borderRightRadius(0))
        .with(
          selector("& > [role=button] + [role=button]")
            .borderLeftRadius(0)
            .marginLeft(-1),
        )}>
      {Children.map(children, (e) => {
        if (isValidElement(e)) {
          return cloneElement(e, { small: small });
        }
        return null;
      })}
    </div>
  );
};
