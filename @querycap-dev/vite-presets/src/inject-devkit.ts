import { stringify } from "@querycap/config";
import { Plugin } from "vite";
import { IState } from "@querycap-dev/devkit";

export const injectDevkit = (state: IState): Plugin => {
  const isProd = state.flags.production;

  return {
    name: "vite-presets/inject-devkit",
    transformIndexHtml(html) {
      return {
        html: html,
        tags: [
          {
            tag: "meta",
            attrs: {
              name: "devkit:app",
              content: stringify({
                appName: state.name,
                env: isProd && !state.flags.noInject ? "__ENV__" : state.env,
                version:
                  isProd && !state.flags.noInject
                    ? process.env.PROJECT_VERSION || "0.0.0"
                    : state.project.version || "",
              }),
            },
          },
          {
            tag: "meta",
            attrs: {
              name: "devkit:config",
              content: isProd && !state.flags.noInject ? "__APP_CONFIG__" : stringify(state.meta.config || {}),
            },
          },
        ],
      };
    },
  };
};
