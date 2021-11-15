import { History, Location, PartialLocation, To } from "history";
import { Children, ComponentType, Fragment, isValidElement, ReactNode, useLayoutEffect, useState } from "react";
import {
  Router as ReactRouter,
  Route as ReactRoute,
  useLocation,
  useMatch,
  useNavigate,
  Outlet,
  Navigate,
  Routes,
  useRoutes,
  useOutlet,
  useParams,
  createRoutesFromChildren,
  useNavigationType,
  useHref,
  useResolvedPath,
  useInRouterContext,
} from "react-router";

export {
  ReactRoute,
  ReactRouter,
  Outlet,
  Navigate,
  Routes,
  useOutlet,
  useRoutes,
  useMatch,
  useParams,
  useNavigate,
  useNavigationType,
  useLocation,
  useHref,
  useResolvedPath,
  useInRouterContext,
  createRoutesFromChildren,
};

export interface RouterProps {
  history: History;
  basename?: string;
  children?: ReactNode;
}

export const Router = ({ basename, history, children }: RouterProps) => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <ReactRouter basename={basename} location={state.location} navigator={history} navigationType={state.action}>
      {children}
    </ReactRouter>
  );
};

interface HistoryNavigates {
  push(to: To, state?: any): void;

  replace(to: To, state?: any): void;

  go(delta: number): void;

  back(): void;

  forward(): void;

  goBack(): void;

  goForward(): void;
}

export const useHistoryNavigate = () => {
  const navigate = useNavigate();

  return {
    push: (to: To) => navigate(to),
    replace: (to: To) => navigate(to, { replace: true }),
    go: (delta: number) => navigate(delta),
    back: () => navigate(-1),
    forward: () => navigate(1),
    goBack: () => navigate(-1),
    goForward: () => navigate(1),
  };
};

interface Router<TParameters> {
  match: {
    params: TParameters;
    pathname: string;
    url: string;
  };
  location: Location;
  history: HistoryNavigates;
}

export const useRouter = <TParameters extends { [k: string]: any }>(): Router<TParameters> => {
  const location = useLocation();
  const history = useHistoryNavigate();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const params = useParams() as any;

  return {
    location,
    match: {
      params,
      pathname: location.pathname,
      url: location.pathname,
    },
    history,
  };
};

export interface RouteProps {
  path?: string;
  exact?: boolean;
  sensitive?: boolean;
  location?: any;
  component?: ComponentType<any>;
  render?: (props: any) => ReactNode;
  children?: (props: any) => ReactNode;
}

const RouteWrap = ({ render, children, component: C }: RouteProps) => {
  const router = useRouter();

  if (C) {
    return <C {...router} />;
  }

  if (render) {
    return <Fragment>{render(router)}</Fragment>;
  }

  if (children) {
    return <Fragment>{children(router)}</Fragment>;
  }

  return null;
};

const mayBeExactPath = (path?: string, exact?: boolean): string => {
  if (exact) {
    return path || "";
  }
  if (path) {
    return path + (path.endsWith("/") ? "*" : "/*");
  }
  return "*";
};

export const Route = ({ path, exact, sensitive, ...otherProps }: RouteProps) => {
  return (
    <Routes>
      <ReactRoute
        path={mayBeExactPath(path, exact)}
        index={exact}
        caseSensitive={sensitive}
        element={<RouteWrap {...otherProps} />}
      />
      <ReactRoute path={"*"} element={null} />
    </Routes>
  );
};

export interface SwitchProps {
  location?: PartialLocation;
  children: ReactNode;
}

export interface RedirectProps {
  // for switch
  from?: string;
  to: To;
  push?: boolean;
  state?: any;
}

export const Redirect = ({ from, to, push, state }: RedirectProps) => {
  if (from) {
    return <Route path={from} render={() => <Navigate to={to} replace={!push} state={state} />} />;
  }
  return <Navigate to={to} replace={!push} state={state} />;
};

// @deprecated Switch to Routes
export const Switch = ({ children, location }: SwitchProps) => {
  return (
    <Routes location={location}>
      {Children.map(children, (e) => {
        if (isValidElement(e)) {
          if (e.type === Redirect) {
            const { from, to, push, state } = e.props as RedirectProps;

            return (
              <ReactRoute
                path={mayBeExactPath(from, !!from)}
                element={<Navigate to={to} replace={!push} state={state} />}
              />
            );
          }

          const { path, exact, sensitive, ...otherProps } = e.props as RouteProps;

          return (
            <ReactRoute
              path={mayBeExactPath(path, exact)}
              caseSensitive={sensitive}
              element={<RouteWrap {...otherProps} />}
            />
          );
        }
        return null;
      })}
    </Routes>
  );
};
