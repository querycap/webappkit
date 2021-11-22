import { UserConfig, Plugin } from "vite";
import { join } from "path";

export const config = (fn: (c: UserConfig) => void): Plugin => {
  return {
    name: "vite-presets/config",
    enforce: "pre",
    config(c) {
      if (!c.build) {
        c.build = {};
      }

      if (!c.build?.assetsDir) {
        c.build.assetsDir = "__built__";
      }

      if (!c.build?.outDir) {
        c.build.outDir = join(process.cwd(), "./public");
      }

      c.build.emptyOutDir = true;

      fn(c);
    },
  };
};
