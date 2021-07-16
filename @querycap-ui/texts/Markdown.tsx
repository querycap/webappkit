import { memo, useMemo } from "react";
import markdown from "remark-parse";
// @ts-ignore
import remark2react from "remark-react";
import { unified } from "unified";

export const Markdown = memo(({ children }: { children: string }) => {
  const parser = useMemo(
    () =>
      unified()
        .use(markdown as any, { commonmark: true } as markdown.RemarkParseOptions)
        .use(remark2react),
    [],
  );

  const contents = useMemo(() => parser.processSync(children).result as JSX.Element, [children]);

  return <div>{contents}</div>;
});
