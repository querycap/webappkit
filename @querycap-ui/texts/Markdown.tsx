import { createMarkdown } from "@querycap/markdown";
import React, { memo } from "react";

const md = createMarkdown();

export const Markdown = memo(({ children }: { children: string }) => (
  <div
    dangerouslySetInnerHTML={{
      __html: md.render(children),
    }}
  />
));
