import { readFileSync } from "fs";
import { sync as globSync, Options } from "fast-glob";

export type GlobbyOptions = Options;

export const loadFiles = (patterns: string[], opts: GlobbyOptions): { [k: string]: string } => {
  return globSync(patterns, {
    ...opts,
    absolute: true,
  }).reduce(
    (files, filepath) => ({
      ...files,
      [filepath]: String(readFileSync(filepath)),
    }),
    {},
  );
};
