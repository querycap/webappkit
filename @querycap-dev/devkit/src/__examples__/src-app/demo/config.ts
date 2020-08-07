// export const GROUP = "gis";

export const ENVS = {
  DEMO: "DEMO",
  ONLINE: "ONLINE",
};

export const APP_MANIFEST = {
  name: "测试",
  background_color: "#19C7B1",
  crossorigin: "use-credentials",
};

export const APP_CONFIG = {
  SRV_TEST: (env: string, feature: string) => {
    if (env === "local") {
      return `//127.0.0.1:80`;
    }

    if (feature === "demo") {
      return `//demo.com`;
    }

    return `//demo.querycap.com`;
  },
};
