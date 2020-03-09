// @ts-ignore
import MarkdownIt from "markdown-it";
// @ts-ignore
import pluginIns from "markdown-it-ins";
// @ts-ignore
import pluginSub from "markdown-it-sub";
// @ts-ignore
import pluginSup from "markdown-it-sup";

export const createMarkdown = () => {
  const md = new MarkdownIt();

  md.use(pluginSup);
  md.use(pluginSub);
  md.use(pluginIns);

  return md as {
    render: (md: string) => string;
  };
};
