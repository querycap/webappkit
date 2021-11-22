import { Plugin, UserConfig } from "vite";
import { existsSync, readFileSync } from "fs";
import { join } from "path";

export const resolve = (r: UserConfig["resolve"] | ((r: UserConfig["resolve"]) => UserConfig["resolve"])): Plugin => {
  const cwd = process.cwd();
  const workspaces: string[] = JSON.parse(String(readFileSync(join(cwd, "package.json")))).workspaces || [];

  const isWorkspace = (source: string): boolean => {
    if (workspaces.length == 0) {
      return false;
    }
    for (let i = 0; i < workspaces.length; i++) {
      if (source.startsWith(workspaces[i].split("/")[0])) {
        return true;
      }
    }
    return false;
  };

  const extensions = [".ts", ".tsx", ".mjs", ".js", ".jsx"];

  return {
    name: "vite-presets/resolve",
    enforce: "pre",
    config(c) {
      c.resolve = {
        ...(typeof r === "function" ? r(c.resolve || {}) : r),
      };
    },
    resolveId(source: string) {
      if (isWorkspace(source)) {
        for (let i = 0; extensions.length; i++) {
          const f = join(cwd, source, "index" + extensions[i]);
          if (existsSync(f)) {
            return f;
          }
        }
      }
      return undefined;
    },
  };
};
