import { withPresets } from "@querycap-dev/webpack-preset";
import { withAssetsPreset } from "@querycap-dev/webpack-preset-assets";
import { withHTMLPreset } from "@querycap-dev/webpack-preset-html";
import { withTsPreset } from "@querycap-dev/webpack-preset-ts";
import glob from "glob";
// @ts-ignore
import { set } from "lodash";
// @ts-ignore
import pkg from "./package.json";

export = withPresets(
  (c) => {
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
    styling: /polished|emotion|react-spring/,
    core: /react|reactorx|scheduler|history|axios/,
    utils: /buffer|date-fns|lodash|rxjs/,
  }),
  (c) => {
    c.resolve!.alias = {
      lodash$: "lodash-es",
    };

    pkg.workspaces
      .map((p) => glob.sync(p, {}))
      .flat()
      .forEach((k) => {
        (c.resolve!.alias as any)[`${k}$`] = `${k}/index`;
      });
  },
  withAssetsPreset(),
  withHTMLPreset(),
);
