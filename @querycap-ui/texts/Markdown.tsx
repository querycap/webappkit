import React, { memo, useMemo } from "react";
import markdown from "remark-parse";
// @ts-ignore
import remark2react from "remark-react";
import unified from "unified";

export const Markdown = memo(({ children }: { children: string }) => {
  const parser = useMemo(() => unified().use(markdown, { commonmark: true }).use(remark2react), []);

  return <div>{parser.processSync(children).contents}</div>;
});
