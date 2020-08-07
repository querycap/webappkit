import { readFileSync } from "fs";
import globby from "globby";

export type GlobbyOptions = globby.GlobbyOptions;

export const loadFiles = (patterns: string[], opts: GlobbyOptions): { [k: string]: string } => {
  return globby
    .sync(patterns, {
      ...opts,
      absolute: true,
    })
    .reduce(
      (files, filepath) => ({
        ...files,
        [filepath]: String(readFileSync(filepath)),
      }),
      {},
    );
};
