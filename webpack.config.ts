import { withPresets } from "@querycap-dev/webpack-preset";
import { withAssetsPreset } from "@querycap-dev/webpack-preset-assets";
import { withHTMLPreset } from "@querycap-dev/webpack-preset-html";
import { withTsPreset } from "@querycap-dev/webpack-preset-ts";
import { sync as globSync } from "fast-glob";
import { set } from "lodash";
import { join, dirname } from "path";
import { existsSync, mkdirSync, rmSync, symlinkSync } from "fs";
import pkg from "./package.json";

export = withPresets(
  (c, state) => {
    const isProd = state.flags.production;

    if (isProd && state.env == "gh-page") {
      state.flags.noInject = true;

      c.output!.path = join(__dirname, `./public/web-${state.name}/static/`);
      c.output!.publicPath = `/${state.meta.config.basename}/static/`;
    }

    console.log(state);

    if (process.env.HTTPS) {
      set(c, "devServer", {
        browserSync: { https: !!process.env.HTTPS },
      });
    }
  },
  withTsPreset({
    polyfill: /babel|core-js/,
    markdown: /unified|remark|remark-react/,
    d3: /d3-shape|d3-path/,
    styling: /polished|emotion|react-spring|react-use-gesture/,
    core: /react|reactorx|scheduler|history|axios/,
    utils: /buffer|date-fns|lodash|rxjs/,
  }) as any,
  (c) => {
    c.resolve!.fallback = { assert: require.resolve("assert/") };

    c.resolve!.alias = {
      path: "path-browserify",
      querystring: "querystring-es3",
      lodash$: "lodash-es",
    };

    if (existsSync("./src-app/sg/examples")) {
      rmSync("./src-app/sg/examples", { recursive: true });
    }

    globSync(pkg.workspaces, { onlyDirectories: true }).forEach((k: string) => {
      const files = globSync([`${k}/{,**/}__examples__/*{.ts,.tsx}`, `!${k}/node_modules/{,**/}*{.ts,.tsx}`]);

      files.forEach((p: string) => {
        const examplePath = `./src-app/sg/examples/${p}`;
        const exampleDir = dirname(examplePath);
        mkdirSync(exampleDir, { recursive: true });
        symlinkSync(join(__dirname, p), examplePath);
      });

      (c.resolve!.alias as any)[`${k}$`] = `${k}/index.ts`;
    });
  },
  withAssetsPreset() as any,
  withHTMLPreset() as any,
);
