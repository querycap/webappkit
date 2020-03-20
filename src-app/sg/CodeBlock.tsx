import { safeTextColor, selector, themes } from "@querycap-ui/core";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/themes/prism-tomorrow.css";

import React, { memo } from "react";

export const CodeBlock = memo(({ children, ...otherProps }: { children: string }) => (
  <pre
    {...otherProps}
    css={selector()
      .margin(0)
      .fontSize(themes.fontSizes.xs)
      .fontFamily(themes.fonts.mono)
      .padding(themes.space.s4)
      .color(safeTextColor(themes.colors.gray9))
      .backgroundColor(themes.colors.gray9)}>
    <code
      dangerouslySetInnerHTML={{
        __html: highlight(children, languages["typescript"], "typescript"),
      }}
    />
  </pre>
));
