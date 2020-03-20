import { selector, ValueOrThemeGetter } from "@querycap-ui/core";
import React, { CSSProperties, ReactNode } from "react";

export const Stack = ({
  inline,
  spacing,
  align,
  justify,
  children,
  ...otherProps
}: {
  inline?: boolean;
  align?: ValueOrThemeGetter<CSSProperties["alignItems"]>;
  justify?: ValueOrThemeGetter<CSSProperties["justifyContent"]>;
  spacing?: ValueOrThemeGetter<number>;
  children?: ReactNode;
}) => {
  return (
    <div
      {...otherProps}
      css={selector()
        .display("flex")
        .flexDirection(inline ? "row" : "column")
        .alignItems(align)
        .justifyContent(justify)
        .with(inline ? selector("& > * + *").marginLeft(spacing) : selector("& > * + *").marginTop(spacing))}>
      {children}
    </div>
  );
};
