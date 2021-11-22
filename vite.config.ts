import {
  applyPlugins,
  config,
  outputAmd,
  resolve,
  vendorChunks,
  workerAsModule,
} from "./@querycap-dev/vite-presets/src";
import { VitePWA } from "vite-plugin-pwa";

const baseURL = "/webappkit/";

export default applyPlugins(
  config((c) => {
    c.base = baseURL;
    c.build!.assetsDir = "static";
  }),
  resolve({
    alias: {
      lodash: "lodash-es",
      path: "path-browserify",
    },
    dedupe: ["react", "react-dom", "@emotion/react"],
  }),
  vendorChunks({
    polyfill: /babel|core-js|tslib/,
    core: /react|reactorx|scheduler|history|axios|object-assign|hey-listen|use-gesture/,
    utils: /buffer|date-fns|lodash|rxjs/,
    styling: /polished|emotion|react-spring|react-use-gesture|stylis|style-to-object/,
    markdown: /micromark|remark|unist|unified|mdast/,
    d3: /d3-shape|d3-path/,
  }),
  // remove this for modern project
  // install requirejs by your self
  outputAmd(),
  workerAsModule(),

  // enabled pwa
  // should install workbox-window
  ...VitePWA({
    manifest: {
      start_url: baseURL,
    },
    includeAssets: ["static/*.*"],
    injectRegister: "script",
    registerType: "autoUpdate",
    workbox: {
      maximumFileSizeToCacheInBytes: 50000000,
    },
  }),
);
