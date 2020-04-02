import { BaseConfig, ConfigProvider } from "@querycap/config";
import { createPersister } from "@querycap/persister";
import { Actor, AsyncStage, Store, StoreProvider, useStore } from "@reactorx/core";
import { ReactorxRouter } from "@reactorx/router";
import { createBrowserHistory } from "history";
import { isFunction } from "lodash";
import React, { ReactElement, ReactNode, StrictMode, useEffect } from "react";
import ReactDOM, { render } from "react-dom";
// @ts-ignore
import { createLogger } from "redux-logger";

function PersisterConnect({ persister }: { persister: ReturnType<typeof createPersister> }) {
  const store$ = useStore();

  useEffect(() => {
    const cleanup = persister.connect(store$);

    return () => {
      cleanup();
    };
  }, []);

  return null;
}

export const createBootstrap = <T extends BaseConfig>(config: T) => (
  e: ReactElement<any> | (() => ReactElement<any>),
) => {
  const persister = createPersister({
    name: config.appName || "app",
  });

  const history = createBrowserHistory({
    basename: "",
    forceRefresh: false,
    keyLength: 6,
    getUserConfirmation: (message, callback) => callback(globalThis.confirm(message)),
  });

  return ($root: Element, async = false) => {
    const finalRender =
      async && (ReactDOM as any).createRoot
        ? (node: ReactNode, $r: Element) => {
            return (ReactDOM as any).createRoot($r).render(node);
          }
        : render;

    persister.hydrate((storeValues = {}) => {
      const store$ = Store.create(storeValues);

      if (process.env.NODE_ENV !== "production") {
        store$.applyMiddleware(
          createLogger({
            duration: true,
            collapsed: true,
            errorTransformer: (e: any) => {
              throw e;
            },
            colors: {
              title: (actor: Actor) => {
                switch (actor.stage) {
                  case AsyncStage.STARTED:
                    return "blue";
                  case AsyncStage.DONE:
                    return "green";
                  case AsyncStage.FAILED:
                    return "red";
                  case AsyncStage.CANCEL:
                    return "orange";
                }
                return "black";
              },
            },
          }),
        );
      }

      finalRender(
        <StrictMode>
          <StoreProvider value={store$}>
            <ConfigProvider value={{ config }}>
              <PersisterConnect persister={persister} />
              <ReactorxRouter history={history}>{isFunction(e) ? e() : e}</ReactorxRouter>
            </ConfigProvider>
          </StoreProvider>
        </StrictMode>,
        $root,
      );
    });
  };
};
