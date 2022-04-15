import { createElement, memo, Fragment, useMemo } from "react";
import remarkParse from "remark-parse";
import { unified } from "unified";
import remarkReact from "remark-react";

export const Markdown = memo(({ children }: { children: string }) => {
  const parser = useMemo(
    () =>
      unified()
        .use(remarkParse as any, { commonmark: true })
        .use(remarkReact, { createElement: createElement as any, Fragment: Fragment }),
    [],
  );

  const contents = useMemo(() => parser.processSync(children).result as JSX.Element, [children]);

  console.log(children, contents);

  return <div>{contents}</div>;
});
