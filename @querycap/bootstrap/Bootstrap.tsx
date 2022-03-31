import { BaseConfig, ConfigProvider } from "@querycap/config";
import { createPersister } from "@querycap/persister";
import { Actor, AsyncStage, Store, StoreProvider, useStore } from "@reactorx/core";
import { PromptUserConfirmation, ReactorxRouter } from "@reactorx/router";
import { createBrowserHistory, createHashHistory } from "history";
import { isFunction } from "@querycap/lodash";
import { ReactElement, ReactNode, StrictMode, useEffect, useMemo } from "react";
import { createRoot } from "react-dom/client";
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

  const history = useMemo(() => createBrowserHistory({}), []);

  return (
    <PromptUserConfirmation getUserConfirmation={confirm}>
      <ReactorxRouter basename={basename} history={history}>
        {children}
      </ReactorxRouter>
    </PromptUserConfirmation>
  );
};

export const HashHistoryProvider = ({ children }: { children: ReactNode }) => {
  const confirm = useConfirm();

  const history = useMemo(() => createHashHistory({}), []);

  return (
    <PromptUserConfirmation getUserConfirmation={confirm}>
      <ReactorxRouter history={history}>{children}</ReactorxRouter>
    </PromptUserConfirmation>
  );
};

export const createBootstrap =
  <T extends BaseConfig>(config: T) =>
  (e: ReactElement | (() => ReactElement)) => {
    console.log(config);

    const persister = createPersister({
      name: config.appName || "app",
    });

    return ($root: Element, strictMode = false) => {
      const r = createRoot($root);

      void persister.hydrate((storeValues = {}) => {
        const store$ = Store.create(storeValues);

        if (process.env.NODE_ENV !== "production") {
          // @ts-ignore
          void import("redux-logger").then(({ createLogger }) => {
            store$.applyMiddleware(
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
          });
        }

        const app = (
          <StoreProvider value={store$}>
            <ConfigProvider value={{ config }}>
              <PersisterConnect persister={persister} />
              <HistoryProvider basename={(config as any).basename}>{isFunction(e) ? e() : e}</HistoryProvider>
            </ConfigProvider>
          </StoreProvider>
        );

        if (strictMode) {
          r.render(<StrictMode>{app}</StrictMode>);
        } else {
          r.render(app);
        }
      });
    };
  };
