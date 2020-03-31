import { BaseConfig, ConfigProvider } from "@querycap/config";
import { createPersister } from "@querycap/persister";
import { Actor, AsyncStage, Store, StoreProvider, useStore } from "@reactorx/core";
import { ReactorxRouter } from "@reactorx/router";
import { createBrowserHistory } from "history";
import { isFunction } from "lodash";
import React, { ReactElement, ReactNode, StrictMode, useEffect } from "react";
import ReactDOM, { render } from "react-dom";

const Bootstrap = (props: { initialValues?: any; children?: React.ReactNode }) => {
  const store$ = Store.create(props.initialValues || {});

  if (process.env.NODE_ENV !== "production") {
    // @ts-ignore
    import("redux-logger").then(({ createLogger }) => {
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
    });
  }

  return (
    <StrictMode>
      <StoreProvider value={store$}>{props.children}</StoreProvider>
    </StrictMode>
  );
};

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
    const r =
      async && (ReactDOM as any).createRoot
        ? (node: ReactNode, $r: Element) => {
            return (ReactDOM as any).createRoot($r).render(node);
          }
        : render;

    persister.hydrate((storeValues) => {
      r(
        <Bootstrap initialValues={storeValues}>
          <ConfigProvider value={{ config }}>
            <PersisterConnect persister={persister} />
            <ReactorxRouter history={history}>{isFunction(e) ? e() : e}</ReactorxRouter>
          </ConfigProvider>
        </Bootstrap>,
        $root,
      );
    });
  };
};
