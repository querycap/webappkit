import { withPresets } from "@querycap-dev/webpack-preset";
import { withAssetsPreset } from "@querycap-dev/webpack-preset-assets";
import { withHTMLPreset } from "@querycap-dev/webpack-preset-html";
import { withTsPreset } from "@querycap-dev/webpack-preset-ts";
import { set } from "lodash";

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
    styling: /polished|emotion|react-spring/,
    core: /react|reactorx|history|axios|localforage/,
    utils: /buffer|moment|lodash|rxjs/,
    markdown: /markdown-it/,
    d3: /d3-shape|d3-path/,
  }),
  (c) => {
    c.resolve!.alias = {
      "@turf/turf$": "@turf/turf/index.js",
      "turf-jsts$": "turf-jsts/jsts.mjs",
      lodash$: "lodash-es",
    };
  },
  withAssetsPreset(),
  withHTMLPreset(),
);
