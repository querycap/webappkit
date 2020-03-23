import { selector, themes } from "@querycap-ui/core";
import React, { ReactNode } from "react";

export const Progress = ({
  inline,
  height,
  children,
  ...props
}: {
  height: number;
  inline?: boolean;
  children?: ReactNode;
}) => (
  <div
    {...props}
    css={selector()
      .height(height)
      .display(inline ? "inline-flex" : "flex")
      .alignItems("stretch")
      .position("relative")
      .lineHeight("inherit")
      .width(inline ? 200 : "100%")
      .overflow("hidden")
      .borderRadius(themes.radii.normal)
      .backgroundColor(themes.colors.gray2)}>
    {children}
  </div>
);
