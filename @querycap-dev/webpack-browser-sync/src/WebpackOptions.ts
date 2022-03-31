import browserSync from "browser-sync";
import { concat, dropWhile, isObject, map, mapValues, reduce } from "@querycap/lodash";
import mime from "mime";
import webpack from "webpack";
// @ts-ignore
import webpackDevMiddleware from "webpack-dev-middleware";
// @ts-ignore
import webpackHotMiddleware from "webpack-hot-middleware";
import path from "path";

export const HMR_ENTRY = "webpack-hot-middleware/client";

export const getHmrPluginsByVersion = (): any[] => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const version = require("webpack/package.json").version;
  const majarVersion = String(version).split(".")[0];

  switch (majarVersion) {
    case "1":
      throw new Error("not support webpack@1");
    case "2":
    default:
      return [webpack.HotModuleReplacementPlugin] as any[];
  }
};

const concatHMREntry = (entry: string): string[] => [HMR_ENTRY].concat(entry);

const isOneOfPlugins = (PluginList: any[], plugin: any) =>
  reduce(PluginList, (result, Plugin) => result || plugin instanceof Plugin, false);

export const patchEntryWithHMR = (entry: string | { [k: string]: string }): string[] | { [k: string]: string[] } => {
  if (isObject(entry)) {
    return mapValues(entry as { [k: string]: string }, concatHMREntry);
  }
  return concatHMREntry(entry);
};

export const patchPlugins = (plugins: any[]) => {
  const hmrPlugins = getHmrPluginsByVersion();
  const cleanedPlugins = dropWhile(plugins, (plugin) => isOneOfPlugins(hmrPlugins, plugin));
  return concat(
    cleanedPlugins,
    map(hmrPlugins, (Plugin: any) => new Plugin()),
  );
};

export const patchWebConfigWithHMR = (webpackConfig: webpack.Configuration): webpack.Configuration => ({
  ...webpackConfig,
  entry: patchEntryWithHMR(webpackConfig.entry as string) as any,
  plugins: patchPlugins(webpackConfig.plugins as any[]),
});

export const createMiddlewaresForWebpack = (webpackConfig: webpack.Configuration, index: string, hot = false) => {
  const patchedWebpackConfig = hot ? patchWebConfigWithHMR(webpackConfig) : webpackConfig;

  const bundler = webpack(patchedWebpackConfig);

  const devMiddleware = webpackDevMiddleware(bundler, {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    publicPath: (patchedWebpackConfig.output || {}).publicPath! as string,
  });

  const devServerMiddlewares = [
    devMiddleware,
    ((req, res, next) => {
      if (req.method === "GET" && req.url === "/") {
        devMiddleware.waitUntilValid(() => {
          const indexFile = path.join(webpackConfig.output!.path!, index);
          res.end(devMiddleware.context.outputFileSystem.readFileSync(indexFile));
        });
      } else {
        try {
          // fallback to try finding relative path link "../sw.js"
          const contentType = mime.getType(req.url!);
          contentType && res.setHeader("content-type", contentType);
          const filename = webpackConfig.output!.path! + ".." + req.url!;
          res.end(devMiddleware.context.outputFileSystem.readFileSync(filename));
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
