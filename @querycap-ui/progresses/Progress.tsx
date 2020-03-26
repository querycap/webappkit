import { select, theme, tintOrShade } from "@querycap-ui/core/macro";
import { flow } from "lodash";
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
    css={select()
      .height(height)
      .display(inline ? "inline-flex" : "flex")
      .alignItems("stretch")
      .position("relative")
      .lineHeight("inherit")
      .width(inline ? 200 : "100%")
      .overflow("hidden")
      .borderRadius(theme.radii.normal)
      .backgroundColor(flow(theme.state.backgroundColor, tintOrShade(0.08)))}>
    {children}
  </div>
);
