import { selector, themes } from "@querycap-ui/core";
import React, { ReactNode } from "react";

export const FormControl = ({
  label,
  error,
  desc,
  children,
}: {
  label?: ReactNode;
  error?: ReactNode;
  desc?: ReactNode;
  children?: ReactNode;
}) => {
  return (
    <label
      css={selector()
        .display("block")
        .position("relative")
        .paddingY("1.75em")}>
      {label && (
        <div
          css={selector()
            .position("absolute")
            .top(0)
            .right(0)
            .left(0)}>
          {label}
        </div>
      )}
      {children}
      {error ? (
        <div
          css={selector()
            .position("absolute")
            .bottom(0)
            .right(0)
            .left(0)
            .paddingY(themes.space.s1)
            .color(themes.colors.danger)
            .fontSize("0.75em")}>
          {error}
        </div>
      ) : (
        desc && (
          <div
            css={selector()
              .position("absolute")
              .bottom(0)
              .right(0)
              .left(0)
              .opacity(0.5)
              .paddingY(themes.space.s1)
              .fontSize("0.75em")}>
            {desc}
          </div>
        )
      )}
    </label>
  );
};
