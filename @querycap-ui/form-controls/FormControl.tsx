import { select, theme } from "@querycap-ui/core/macro";
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
    <label css={select().display("block").position("relative").paddingY("1.75em")}>
      {label && <div css={select().position("absolute").top(0).right(0).left(0)}>{label}</div>}
      {children}
      {error ? (
        <div
          css={select()
            .position("absolute")
            .bottom(0)
            .right(0)
            .left(0)
            .paddingY(theme.space.s1)
            .color(theme.colors.danger)
            .fontSize("0.75em")}>
          {error}
        </div>
      ) : (
        desc && (
          <div
            css={select()
              .position("absolute")
              .bottom(0)
              .right(0)
              .left(0)
              .opacity(0.5)
              .paddingY(theme.space.s1)
              .fontSize("0.75em")}>
            {desc}
          </div>
        )
      )}
    </label>
  );
};
