import { History } from "history";
import  { ReactNode, useEffect, useState } from "react";
import { IMatch } from "./utils";
import { RouterProvider } from "./RouterContext";

const computeRootMatch = (pathname: string): IMatch<any> => {
  return {
    path: "/",
    url: "/",
    params: {},
    isExact: pathname === "/",
  };
};

export interface IRouterProps {
  history: History;
  children: ReactNode;
}


function HistoryListener({ history, onLocationChange }: { history: History; onLocationChange: () => void }) {
  useEffect(() => {
    const unlisten = history.listen(() => {
      onLocationChange();
    });
    return () => {
      unlisten();
    };
  }, []);

  return null;
}

export function Router({ history, children }: IRouterProps) {
  const [location, updateRoute] = useState(history.location);

  return (
    <RouterProvider
      value={{
        history,
        location,
        match: computeRootMatch(location.pathname),
      }}>
      <HistoryListener history={history} onLocationChange={() => updateRoute(() => history.location)} />
      {children}
    </RouterProvider>
  );
}