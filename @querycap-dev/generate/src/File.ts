import { readFileSync } from "fs";
import glob from "fast-glob";

export type GlobbyOptions = glob.Options;

export const loadFiles = (patterns: string[], opts: GlobbyOptions): { [k: string]: string } => {
  return glob
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
