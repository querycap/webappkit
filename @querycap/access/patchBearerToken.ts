import { AxiosRequestConfig } from "@querycap/request";
import { Store } from "@reactorx/core";
import { AxiosInterceptorManager } from "axios";
import { get, has, set, size, some } from "lodash";
import { accessKey, hasLogon } from "./AccessToken";
import { TokenSet } from "./TokenSet";

export const getAccessTokenFromState = (state: any) => {
  const access = get(state, accessKey, {});

  if (hasLogon(access)) {
    return access.accessToken;
  }

  return "";
};

export const patchBearerToken = ({ getState }: Store, ...excludeBasePaths: string[]) => {
  return (req: AxiosInterceptorManager<AxiosRequestConfig>) => {
    req.use((axiosRequestConfig: AxiosRequestConfig) => {
      if (
        size(excludeBasePaths) > 0 &&
        some(excludeBasePaths, (basePath) => (axiosRequestConfig.url || "").startsWith(basePath))
      ) {
        return axiosRequestConfig;
      }

      const token = getAccessTokenFromState(getState());

      if (token) {
        const authorization = TokenSet.parse((axiosRequestConfig.headers || {}).Authorization)
          .with("Bearer", token)
          .toString();

        if (has(axiosRequestConfig.params, "authorization")) {
          set(axiosRequestConfig.params, "authorization", authorization);
        } else {
          set(axiosRequestConfig.headers, "Authorization", authorization);
        }
      }

      return axiosRequestConfig;
    });
  };
};
