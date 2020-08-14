import axios, {
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from "axios";
import { forEach, set } from "lodash";
import { IEpic } from "@reactorx/core";
import {
  catchError as rxCatchError,
  filter as rxFilter,
  ignoreElements,
  map as rxMap,
  mergeMap as rxMergeMap,
  observeOn,
  switchMap,
  tap as rxTap,
} from "rxjs/operators";
import { RequestActor } from "./RequestActor";

import { paramsSerializer, transformRequest } from "./utils";
import { asyncScheduler, from as observableFrom, merge, Observable, of as observableOf } from "rxjs";

export type TRequestInterceptor = (
  request: AxiosInterceptorManager<AxiosRequestConfig>,
  response: AxiosInterceptorManager<AxiosResponse>,
) => void;

export function setDefaultContentType(config: AxiosRequestConfig): AxiosRequestConfig {
  if (!config.headers || !config.headers["Content-Type"]) {
    set(config, ["headers", "Content-Type"], "application/json");
  }
  return config;
}

export const createAxiosInstance = (options: AxiosRequestConfig, ...interceptors: TRequestInterceptor[]) => {
  const client = axios.create({
    ...options,
    paramsSerializer,
    transformRequest,
  });

  client.interceptors.request.use(setDefaultContentType);

  forEach(interceptors, (interceptor) => {
    interceptor(client.interceptors.request, client.interceptors.response);
  });

  return client;
};

const alterActorCancelTokenSource = (actor: any, cancelTokenSource: CancelTokenSource) => {
  actor.__CANCEL_TOKEN_SOURCE__ = cancelTokenSource;
};

const cancelActorIfExists = (actor: any) => {
  actor.__CANCEL_TOKEN_SOURCE__?.cancel();
  actor.__CANCEL__ = true;
};

const isCancelActor = (actor: any) => {
  return actor.__CANCEL__;
};

function creatRequestFactory(client: AxiosInstance) {
  const cachedRequest$: {
    [k: string]: {
      cancelTokenSource?: CancelTokenSource;
      config: AxiosRequestConfig;
      source$: Observable<AxiosResponse>;
    };
  } = {};

  const createSource = (source?: CancelTokenSource) => {
    if (source && (source as any).increase) {
      (source as any).increase();
      return source;
    }

    const cancelTokenSource = axios.CancelToken.source();

    let used = 1;

    return {
      token: cancelTokenSource.token,
      increase() {
        used++;
      },
      cancel() {
        used--;

        if (used <= 0) {
          cancelTokenSource.cancel();
        }
      },
    };
  };

  return {
    create: (actor: RequestActor) => {
      const axiosRequestConfig = actor.requestConfig();

      const uri = axiosRequestConfig.method?.toLowerCase() === "get" && client.getUri(axiosRequestConfig);

      const request = () => {
        if (uri) {
          const c = cachedRequest$[uri];

          if (c) {
            alterActorCancelTokenSource(actor, createSource(c.cancelTokenSource));
            return c.source$;
          }

          const cancelTokenSource = createSource();
          alterActorCancelTokenSource(actor, cancelTokenSource);
          axiosRequestConfig.cancelToken = cancelTokenSource.token;

          return (cachedRequest$[uri] = {
            cancelTokenSource,
            config: axiosRequestConfig,
            source$: observableFrom(client.request(axiosRequestConfig)),
          }).source$;
        }

        const cancelTokenSource = createSource();
        axiosRequestConfig.cancelToken = cancelTokenSource?.token;
        alterActorCancelTokenSource(actor, cancelTokenSource);

        return observableFrom(client.request(axiosRequestConfig));
      };

      request.clear = () => {
        if (uri) {
          delete cachedRequest$[uri];
        }
      };

      request.config = axiosRequestConfig;

      return request;
    },
  };
}

export const createRequestEpicFromAxiosInstance = (client: AxiosInstance): IEpic => {
  const requestFactory = creatRequestFactory(client);

  const fakeCancelRequest = (axiosRequestConfig: AxiosRequestConfig) => {
    const source = axios.CancelToken.source();
    source.cancel();

    return observableFrom(
      client.request({
        ...axiosRequestConfig,
        cancelToken: source.token,
      }),
    );
  };

  return (actor$) => {
    return merge(
      actor$.pipe(
        rxFilter(RequestActor.isPreRequestActor),
        rxMergeMap((actor) => {
          const request = requestFactory.create(actor);

          return merge(
            observableOf(actor.started.with(request.config)),
            request().pipe(
              switchMap((response) => {
                if (isCancelActor(actor)) {
                  return fakeCancelRequest(request.config);
                }
                return observableOf(response);
              }),
              rxMap((response) => actor.done.with(response)),
              rxCatchError((err) => {
                return observableOf(actor.failed.with(err));
              }),
              rxTap(() => {
                request.clear();
              }),
            ),
          );
        }),
      ),
      actor$.pipe(
        rxFilter(RequestActor.isCancelRequestActor),
        rxMap((actor) => {
          cancelActorIfExists(actor.opts.parentActor);
        }),
        ignoreElements(),
      ),
    ).pipe(observeOn(asyncScheduler));
  };
};

export const createRequestEpic = (options: AxiosRequestConfig, ...interceptors: TRequestInterceptor[]): IEpic => {
  return createRequestEpicFromAxiosInstance(createAxiosInstance(options, ...interceptors));
};
