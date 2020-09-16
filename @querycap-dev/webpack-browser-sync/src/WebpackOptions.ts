import browserSync from "browser-sync";
import { concat, dropWhile, isObject, map, mapValues, reduce } from "lodash";
import mime from "mime";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import path from "path";

export const HMR_ENTRY = "webpack-hot-middleware/client";

export interface IPlugin extends webpack.Plugin {
  // eslint-disable-next-line @typescript-eslint/no-misused-new
  new (): IPlugin;
}

export const getHmrPluginsByVersion = (): IPlugin[] => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const version = require("webpack/package.json").version;
  const majarVersion = String(version).split(".")[0];

  switch (majarVersion) {
    case "1":
      throw new Error("not support webpack@1");
    case "2":
    default:
      return [webpack.HotModuleReplacementPlugin] as IPlugin[];
  }
};

const concatHMREntry = (entry: string): string[] => [HMR_ENTRY].concat(entry);

const isOneOfPlugins = (PluginList: IPlugin[], plugin: webpack.Plugin) =>
  reduce(PluginList, (result, Plugin) => result || plugin instanceof Plugin, false);

export const patchEntryWithHMR = (entry: string | { [k: string]: string }): string[] | { [k: string]: string[] } => {
  if (isObject(entry)) {
    return mapValues(entry as { [k: string]: string }, concatHMREntry);
  }
  return concatHMREntry(entry);
};

export const patchPlugins = (plugins: IPlugin[]) => {
  const hmrPlugins = getHmrPluginsByVersion();
  const cleanedPlugins = dropWhile(plugins, (plugin) => isOneOfPlugins(hmrPlugins, plugin));
  return concat(
    cleanedPlugins,
    map(hmrPlugins, (Plugin: IPlugin) => new Plugin()),
  );
};

export const patchWebConfigWithHMR = (webpackConfig: webpack.Configuration): webpack.Configuration => ({
  ...webpackConfig,
  entry: patchEntryWithHMR(webpackConfig.entry as string),
  plugins: patchPlugins(webpackConfig.plugins as IPlugin[]),
});

export const createMiddlewaresForWebpack = (webpackConfig: webpack.Configuration, index: string, hot = false) => {
  const patchedWebpackConfig = hot ? patchWebConfigWithHMR(webpackConfig) : webpackConfig;

  const bundler = webpack(patchedWebpackConfig);

  const devMiddleware = webpackDevMiddleware(bundler, {
    publicPath: (patchedWebpackConfig.output || {}).publicPath!,
    stats: patchedWebpackConfig.stats || {
      colors: true,
      reasons: false,
      hash: false,
      version: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      cached: false,
    },
  });

  const devServerMiddlewares = [
    devMiddleware,
    ((req, res, next) => {
      if (req.method === "GET" && req.url === "/") {
        devMiddleware.waitUntilValid(() => {
          const indexFile = path.join(webpackConfig.output!.path!, index);
          res.end(devMiddleware.fileSystem.readFileSync(indexFile));
        });
      } else {
        try {
          // fallback to try finding relative path link "../sw.js"
          const contentType = mime.getType(req.url!);
          contentType && res.setHeader("content-type", contentType);
          const filename = webpackConfig.output!.path! + ".." + req.url!;
          res.end(devMiddleware.fileSystem.readFileSync(filename));
        } catch (e) {
          next();
        }
      }
    }) as browserSync.MiddlewareHandler,
  ];

  if (hot) {
    return [...devServerMiddlewares, webpackHotMiddleware(bundler)];
  }

  return devServerMiddlewares;
};
