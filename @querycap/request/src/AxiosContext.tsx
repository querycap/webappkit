import { errorPatch } from "./StatusError";
import { composeEpics, epicOn } from "@reactorx/core";
import {
  createRequestEpicFromAxiosInstance,
  paramsSerializer,
  setDefaultContentType,
  transformRequest,
  TRequestInterceptor,
} from "@reactorx/request";
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { Dictionary, forEach } from "lodash";
import React, { createContext, ReactNode, useContext, useMemo } from "react";
import { RequestActor } from "./RequestActor";
import { urlComplete } from "./utils";

const AxiosContext = createContext<{ client?: AxiosInstance }>({});

export const useAxiosInstance = () => useContext(AxiosContext).client!;

export const AxiosProvider = ({
  children,
  baseURLs,
  options,
  interceptors = [],
}: {
  children: ReactNode;
  baseURLs?: Dictionary<string>;
  options?: AxiosRequestConfig;
  interceptors?: TRequestInterceptor[];
}) => {
  const opts = {
    ...options,
  };

  const client = useMemo(() => {
    const c = axios.create({
      ...opts,
      paramsSerializer,
      transformRequest,
    });

    if (baseURLs) {
      const complete = urlComplete(baseURLs);

      const patchURL = (axiosRequestConfig: AxiosRequestConfig) => {
        axiosRequestConfig.url = complete(axiosRequestConfig.url);
        axiosRequestConfig.baseURL = undefined;
        return axiosRequestConfig;
      };

      interceptors = [
        (req) => {
          req.use((axiosRequestConfig: AxiosRequestConfig) => {
            return patchURL(axiosRequestConfig);
          });
        },
        errorPatch,
        ...interceptors,
      ];

      const originGetURL = c.getUri.bind(c);

      const getUri = (config: AxiosRequestConfig) => {
        return originGetURL(patchURL(config));
      };

      c["getUri"] = getUri.bind(c);
    }

    c.interceptors.request.use(setDefaultContentType);

    forEach(interceptors, (interceptor) => {
      interceptor(c.interceptors.request, c.interceptors.response);
    });

    return c;
  }, []);

  return (
    <AxiosContext.Provider value={{ client }}>
      {epicOn(composeEpics(createRequestEpicFromAxiosInstance(client)))}
      {children}
    </AxiosContext.Provider>
  );
};

export const A = ({
  requestActor,
  ...otherProps
}: { requestActor: RequestActor } & React.HTMLAttributes<HTMLAnchorElement>) => {
  const axiosInstance = useAxiosInstance();

  return <a {...otherProps} href={axiosInstance.getUri(requestActor.requestConfig())} />;
};
