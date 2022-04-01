import { IState } from "@querycap-dev/devkit";
import { existsSync } from "fs";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { dirname, join } from "path";
import { stringify } from "@querycap/config";
// @ts-ignore
import { Configuration, DefinePlugin } from "webpack";
import WebpackPwaManifest from "webpack-pwa-manifest";
import { InjectManifest } from "workbox-webpack-plugin";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const resolvePkgRoot = (p: string): string => {
  const packageJSON = join(p, "./package.json");

  if (!existsSync(packageJSON)) {
    return resolvePkgRoot(join(p, "../"));
  }

  return p;
};

export const withHTMLPreset =
  ({ meta }: { meta?: { [key: string]: string } } = {}) =>
  (c: Configuration, state: IState) => {
    const isProd = state.flags.production;

    const enablePWA = isProd && existsSync(join(c.context!, "./logo.png"));
    const hasFavicon = existsSync(join(c.context!, "./favicon.ico"));
    const hasIndexHTML = existsSync(join(c.context!, "./index.html"));

    const indexHTML = "../index.html";

    c.plugins?.push(
      new HtmlWebpackPlugin({
        favicon: hasFavicon ? "./favicon.ico" : undefined,
        template: hasIndexHTML ? "./index.html" : join(resolvePkgRoot(__dirname), "./index-default.html"),
        filename: indexHTML,
        inject: true,
        showErrors: true,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        title: state.meta.manifest?.name,
        meta: {
          ...meta,
          "devkit:app": stringify({
            appName: state.name,
            env: isProd && !state.flags.noInject ? "__ENV__" : state.env,
            version:
              isProd && !state.flags.noInject ? process.env.PROJECT_VERSION || "0.0.0" : state.project.version || "",
          }),
          "devkit:config": isProd && !state.flags.noInject ? "__APP_CONFIG__" : stringify(state.meta.config || {}),
        },
      }) as any,
    );

    if (enablePWA) {
      c.plugins?.push(
        new DefinePlugin({
          "process.env.PWA_ENABLED": `"true"`,
        }),
        // todo fix
        new WebpackPwaManifest({
          ...(state.meta.manifest as any),
          short_name: state.name,
          start_url: "/",
          icons: [
            {
              src: join(c.context!, "./logo.png"),
              sizes: [144, 256, 512],
            },
          ],
        }) as any,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        new InjectManifest({
          swDest: "../sw.js",
          swSrc: existsSync(join(c.context!, "./service-worker.ts"))
            ? "./service-worker.ts"
            : join(resolvePkgRoot(__dirname), "./service-worker-default.ts"),
          exclude: [/\.(?:png|jpg|jpeg|svg|chunk\.js)$/],
        }),
      );
    }
  };
