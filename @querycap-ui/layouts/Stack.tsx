import type { ValueOrThemeGetter } from "@querycap-ui/core";
import { fromTheme, negative } from "@querycap-ui/core";
import { select } from "@querycap-ui/core/macro";
import { flow } from "lodash";
import { CSSProperties, HTMLAttributes, ReactNode } from "react";

export const Stack = ({
  inline,
  spacing,
  align,
  wrap,
  justify,
  children,
  ...otherProps
}: HTMLAttributes<HTMLDivElement> & {
  inline?: boolean;
  align?: ValueOrThemeGetter<CSSProperties["alignItems"]>;
  justify?: ValueOrThemeGetter<CSSProperties["justifyContent"]>;
  wrap?: ValueOrThemeGetter<CSSProperties["flexWrap"]>;
  spacing?: ValueOrThemeGetter<number>;
  children?: ReactNode;
}) => {
  return (
    <div
      {...otherProps}
      css={select()
        .display("flex")
        .flexDirection(inline ? "row" : "column")
        .alignItems(align)
        .justifyContent(justify)
        .flexWrap(wrap)
        .with(
          inline
            ? select()
                .marginLeft(flow(fromTheme(spacing), negative))
                .with(select("& > *").marginLeft(spacing))
            : select("& > * + *").marginTop(spacing),
        )}>
      {children}
    </div>
  );
};
