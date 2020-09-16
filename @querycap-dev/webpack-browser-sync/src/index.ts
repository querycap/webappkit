import browserSync from "browser-sync";
import compress from "compression";
import connectHistoryApiFallback from "connect-history-api-fallback";
import interpret from "interpret";
import { get } from "lodash";
import path from "path";
import { getBaseDir } from "./utils";
import { createMiddlewaresForWebpack } from "./WebpackOptions";

export interface IOptions {
  config: string;
  index: string;
  proxy: string;
  webpack: boolean;
  hot: boolean;
  compress: boolean;
  historyApiFallback: boolean;
}

interface IInterpret {
  module: string;
  register: (module: any) => void;
}

type TModuleDescriptor = null | string | string[] | IInterpret;

function registerCompiler(moduleDescriptor: TModuleDescriptor) {
  if (moduleDescriptor) {
    if (typeof moduleDescriptor === "string") {
      require(moduleDescriptor);
    } else if (!Array.isArray(moduleDescriptor)) {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      moduleDescriptor.register(require(moduleDescriptor.module));
    } else {
      for (const moduleName of moduleDescriptor) {
        if (moduleName) {
          try {
            registerCompiler(moduleName);
            break;
          } catch (e) {
            // do nothing
          }
        }
      }
    }
  }
}

const createBrowserSyncOptions = (options: IOptions): browserSync.Options => {
  const webpackConfigFile = path.join(process.cwd(), options.config);
  const webpackConfigFileExt = path.extname(webpackConfigFile);

  registerCompiler(interpret.extensions[webpackConfigFileExt] as any);

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const webpackConfig = require(webpackConfigFile);

  let middlewares: browserSync.MiddlewareHandler[] = [];

  if (options.historyApiFallback) {
    middlewares = middlewares.concat(
      connectHistoryApiFallback({
        index: "/",
      }) as any,
    );
  }

  if (options.webpack) {
    middlewares = middlewares.concat(createMiddlewaresForWebpack(webpackConfig, options.index, options.hot) as any);
  }

  if (options.compress) {
    middlewares = middlewares.concat(compress({ level: 6 }) as browserSync.MiddlewareHandler);
  }

  if (options.proxy) {
    return {
      ...get(webpackConfig, "devServer.browserSync"),
      proxy: {
        target: options.proxy,
        middleware: middlewares,
      } as any,
    };
  }

  return {
    ...get(webpackConfig, "devServer.browserSync"),
    ...(process.env.PORT
      ? {
          port: Number(process.env.PORT),
        }
      : {}),
    server: {
      baseDir: getBaseDir(webpackConfig.output.path, webpackConfig.output.publicPath),
      index: path.join(webpackConfig.output.publicPath || "/", options.index),
      middleware: middlewares,
    },
    notify: false,
  };
};

export const create = (opts: IOptions) => {
  return browserSync(createBrowserSyncOptions(opts));
};
