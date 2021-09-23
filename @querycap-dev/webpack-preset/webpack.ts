import { IState, stateFromEnvValue } from "@querycap-dev/devkit";
import { join } from "path";
import { Configuration, DefinePlugin, LoaderOptionsPlugin } from "webpack";
// @ts-ignore
import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

export type TPreset = (c: Configuration, state: IState) => void;

export const withPresets = (...presets: TPreset[]): Configuration => {
  const state = stateFromEnvValue(process.env.DEVKIT || "");

  const c: Configuration = {
    context: state.context,
    entry: {
      app: `./index.ts`,
    },
    output: {
      path: join(state.cwd, `public/web-${state.name}`, `/__built__/`),
      publicPath: `/__built__/`,
      chunkFilename: `[name]${state.flags.production ? ".[contenthash]" : ""}.chunk.js`,
      filename: `[name]${state.flags.production ? ".[contenthash]" : ""}.js`,
      pathinfo: state.flags.production,
    },
    mode: state.flags.production ? "production" : "development",
    performance: {
      hints: state.flags.production ? "warning" : false,
    },
    optimization: {},
    module: {
      rules: [],
    },
    resolve: {},
    node: {},
    plugins: [
      new DefinePlugin({
        ".js'": "'",
        "process.env": {
          NODE_ENV: `"${state.flags.production ? "production" : "development"}"`,
        },
      }),
    ],
  };

  presets.forEach((preset) => {
    preset(c, Object.freeze(state));
  });

  if (state.flags.production) {
    c.plugins?.push(
      new LoaderOptionsPlugin({
        minimize: true,
        debug: false,
      }),
    );
  }

  if (state.flags.debug) {
    c.plugins = [
      ...(c.plugins || []),
      new BundleAnalyzerPlugin({
        defaultSizes: "gzip",
        openAnalyzer: true,
      }),
    ];
  }

  return c;
};
