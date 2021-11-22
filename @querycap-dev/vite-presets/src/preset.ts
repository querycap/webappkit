import { defineConfig, Plugin } from "vite";
import { stateFromEnvValue } from "@querycap-dev/devkit";
import nodeResolve from "@rollup/plugin-node-resolve";
import { babel as rollupBabel } from "@rollup/plugin-babel";
import { join } from "path";
import { config } from "./config";
import { injectDevkit } from "./inject-devkit";

export * from "vite";

export const applyPlugins = (...plugins: Plugin[]) => {
  const state = stateFromEnvValue(process.env.DEVKIT || "{}");
  const extensions = [".ts", ".tsx", ".mjs", ".js", ".jsx"];

  return defineConfig({
    plugins: [
      config((c) => {
        c.root = state.context;
        c.build!.outDir = join(state.cwd, "./public", `web-${state.name}`);
      }),
      injectDevkit(state),
      nodeResolve({
        mainFields: ["browser", "jsnext:main", "module", "main"],
        moduleDirectories: [
          // project root for mono repo
          state.cwd,
          // root node_modules first
          join(state.cwd, "node_modules"),
          // then related node_modules
          "node_modules",
        ],
        extensions: extensions,
      }) as any,
      {
        enforce: "pre",
        ...rollupBabel({
          babelrc: true,
          babelHelpers: "runtime",
          exclude: "node_modules/**",
          extensions: extensions,
        }),
      },
      ...plugins,
    ],
  });
};
