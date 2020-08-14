import { createContext, useContext } from "react";
import { History, Location } from "history";
import { IMatch } from "./utils";

export interface IRoute<TParameters> {
  location: Location;
  match: IMatch<TParameters>;
}

export interface IRouterContext<TParameters = any> extends IRoute<TParameters> {
  history: History;
}

const RouterContext = createContext({} as IRouterContext<any>);

export const RouterProvider = RouterContext.Provider;

export function useRouter<TParameters = any>() {
  return useContext<IRouterContext<TParameters>>(RouterContext);
}
