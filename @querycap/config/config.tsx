import { parse } from "querystring";
import React, { createContext, ReactNode, useContext } from "react";

export type BaseConfig = { appName: string; env: string; version: string };

const ConfigContext = createContext<{ config: any }>({ config: {} as any });

const ConfigProvider = ConfigContext.Provider;

export const useConfig = <T extends BaseConfig>(): T => useContext(ConfigContext).config || {};

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

  const conf = (): { [key in TKeys]: string } & BaseConfig => {
    return {
      ...config,
      ...app,
    } as any;
  };

  conf.Provider = ({ children }: { children: ReactNode }) => (
    <ConfigProvider
      value={{
        config: conf(),
      }}>
      {children}
    </ConfigProvider>
  );

  return conf;
}
