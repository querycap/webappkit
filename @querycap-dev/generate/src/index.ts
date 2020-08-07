import chalk from "chalk";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import * as path from "path";
// @ts-ignore
import * as prettier from "prettier";

export interface IOpt {
  cwd: string;
}

export const generate = (
  filepath: string,
  content: string,
  opt: IOpt = {
    cwd: process.cwd(),
  } as IOpt,
) => {
  let finalFilepath = filepath;

  if (!path.isAbsolute(filepath)) {
    finalFilepath = path.resolve(opt.cwd, filepath);
  }

  try {
    content = prettier.format(content, {
      ...prettier.resolveConfig.sync(finalFilepath),
      filepath: finalFilepath,
    });
  } catch (e) {
    // console.log(e);
  }

  const dir = path.dirname(finalFilepath);

  if (!existsSync(dir)) {
    mkdirSync(path.dirname(finalFilepath));
  }

  writeFileSync(finalFilepath, content);

  console.log(chalk.green(`generated file ${finalFilepath}`));
};

export * from "./File";
