import { select, theme } from "@querycap-ui/core/macro";
import React, { Children, cloneElement, isValidElement, ReactNode } from "react";

export const ButtonGroup = ({ small, children }: { small?: boolean; children?: ReactNode }) => {
  return (
    <div
      css={select()
        .with(select("& > [role=button]").borderRadius(0))
        .with(select("& > [role=button]:first-of-type").borderLeftRadius(theme.radii.s))
        .with(select("& > [role=button]:last-of-type").borderRightRadius(theme.radii.s))
        .with(select("& > [role=button] + [role=button]").marginX(-1))
        .with(select("& > [role=button][data-primary=true]").zIndex(1))}>
      {Children.map(children, (e) => {
        if (isValidElement(e)) {
          return cloneElement(e, { small: small });
        }
        return null;
      })}
    </div>
  );
};
