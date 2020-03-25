import { selector, themes, tintOrShade } from "@querycap-ui/core";
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
      .backgroundColor((t) => tintOrShade(0.08, t.state.backgroundColor))}>
    {children}
  </div>
);
