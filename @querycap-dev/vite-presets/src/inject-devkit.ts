import { stringify } from "@querycap/config";
import { Plugin } from "vite";
import { IState } from "@querycap-dev/devkit";

export const injectDevkit = (state: IState): Plugin => {
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
                env: state.env || "dev",
                version: state.project.version || "0.0.0",
              }),
            },
          },
          {
            tag: "meta",
            attrs: {
              name: "devkit:config",
              content: stringify(state.meta.config || {}),
            },
          },
        ],
      };
    },
  };
};
