import { parse } from "querystring";

const getDevKitValue = (key: string) => {
  return globalThis.document?.querySelector(`meta[name="devkit:${key}"]`)?.getAttribute("content") || "";
};

export function confLoader<TKeys extends string>() {
  const app = parse(getDevKitValue("app"), ",", "=", {
    decodeURIComponent: (v) => v,
  });
  const config = parse(getDevKitValue("config"), ",", "=", {
    decodeURIComponent: (v) => v,
  });

  return function conf(): { [key in TKeys]: string } & { appName: string; env: string; version: string } {
    return {
      ...config,
      ...app,
    } as any;
  };
}
