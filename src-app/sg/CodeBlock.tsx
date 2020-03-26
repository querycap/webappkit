import { colors, safeTextColor, select, theme } from "@querycap-ui/core";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/themes/prism-tomorrow.css";

import React, { memo } from "react";

export const CodeBlock = memo(({ children, ...otherProps }: { children: string }) => (
  <pre
    {...otherProps}
    css={select()
      .borderRadius(theme.radii.normal)
      .margin(0)
      .fontFamily(theme.fonts.mono)
      .padding(theme.space.s4)
      .overflow("auto")
      .color(safeTextColor(colors.gray9))
      .backgroundColor(colors.gray9)}>
    <code
      dangerouslySetInnerHTML={{
        __html: highlight(children, languages["typescript"], "typescript"),
      }}
    />
  </pre>
));
