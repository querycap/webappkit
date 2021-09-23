import { BaseConfig, ConfigProvider } from "@querycap/config";
import { createPersister } from "@querycap/persister";
import { Actor, AsyncStage, Store, StoreProvider, useStore } from "@reactorx/core";
import { ReactorxRouter } from "@reactorx/router";
import { createBrowserHistory, createHashHistory } from "history";
import { isFunction } from "lodash";
import { ReactElement, ReactNode, StrictMode, useEffect, useMemo } from "react";
import ReactDOM, { render } from "react-dom";
// @ts-ignore
import { createLogger } from "redux-logger";
import { useConfirm } from "@querycap/notify";

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

export const HistoryProvider = ({ children, basename = "" }: { children: ReactNode; basename: string }) => {
  const confirm = useConfirm();

  const history = useMemo(
    () =>
      createBrowserHistory({
        basename: basename,
        forceRefresh: false,
        keyLength: 6,
        getUserConfirmation: (message, callback) => confirm(message, callback),
      }),
    [],
  );

  return <ReactorxRouter history={history}>{children}</ReactorxRouter>;
};

export const HashHistoryProvider = ({ children }: { children: ReactNode }) => {
  const confirm = useConfirm();

  const history = useMemo(
    () =>
      createHashHistory({
        basename: "",
        getUserConfirmation: (message, callback) => confirm(message, callback),
      }),
    [],
  );

  return <ReactorxRouter history={history}>{children}</ReactorxRouter>;
};

export const createBootstrap =
  <T extends BaseConfig>(config: T) =>
  (e: ReactElement | (() => ReactElement)) => {
    const persister = createPersister({
      name: config.appName || "app",
    });

    return ($root: Element, async = false) => {
      const finalRender =
        async && (ReactDOM as any).createRoot
          ? (node: ReactNode, $r: Element) => {
              return (ReactDOM as any).createRoot($r).render(node);
            }
          : render;

      void persister.hydrate((storeValues = {}) => {
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
                <HistoryProvider basename={(config as any).basename}>{isFunction(e) ? e() : e}</HistoryProvider>
              </ConfigProvider>
            </StoreProvider>
          </StrictMode>,
          $root,
        );
      });
    };
  };
