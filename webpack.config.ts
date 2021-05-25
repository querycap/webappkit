import { withPresets } from "@querycap-dev/webpack-preset";
import { withAssetsPreset } from "@querycap-dev/webpack-preset-assets";
import { withHTMLPreset } from "@querycap-dev/webpack-preset-html";
import { withTsPreset } from "@querycap-dev/webpack-preset-ts";
// @ts-ignore
import glob from "glob";
// @ts-ignore
import { set } from "lodash";
import { join } from "path";
// @ts-ignore
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
    c.resolve!.alias = {
      path: "path-browserify",
      querystring: "querystring-es3",
      lodash$: "lodash-es",
    };

    pkg.workspaces
      .map((p) => glob.sync(p, {}))
      .flat()
      .forEach((k) => {
        (c.resolve!.alias as any)[`${k}$`] = `${k}/index`;
      });
  },
  withAssetsPreset() as any,
  withHTMLPreset() as any,
);
