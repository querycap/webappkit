import yargs from "yargs";

import { create } from "./index";

export const cli = () => {
  const argv = yargs(process.argv.slice(2))
    .usage("Usage: $0 [options]")

    .example("webpack-browser-sync", "")

    .options({
      config: {
        description: "path to webpack.config",
        alias: "c",
        default: "./webpack.config.js",
        required: true,
      },
      webpack: {
        description: "enable webpack",
        type: "boolean",
        default: true,
      },
      index: {
        description: "index.html relative path from webpackConfig.output.path",
        type: "string",
        default: "index.html",
      },
      hot: {
        description: "enable hot module replacement [need enabled webpack]",
        type: "boolean",
      },
      proxy: {
        description: "use proxy for remote debug",
        type: "string",
      },
      compress: {
        description: "enable gzip",
        type: "boolean",
      },
      historyApiFallback: {
        description: "enable history api fallback",
        type: "boolean",
      },
    })
    .help("help")
    .alias("help", "h")
    .showHelpOnFail(false, "whoops, something went wrong! run with --help").argv;

  create(argv as any);
};
