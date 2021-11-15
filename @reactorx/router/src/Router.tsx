import { History, Location, PartialLocation, To } from "history";
import {
  Children,
  ComponentType,
  Fragment,
  isValidElement,
  ReactNode,
  useContext,
  useLayoutEffect,
  useState,
} from "react";
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
  generatePath,
  UNSAFE_RouteContext,
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
  generatePath,
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

export const useHistory = (location: Location) => {
  const navigate = useNavigate();
  return {
    location: location,
    push: (to: To) => navigate(to),
    replace: (to: To) => navigate(to, { replace: true }),
    go: (delta: number) => navigate(delta),
    back: () => navigate(-1),
    forward: () => navigate(1),
    goBack: () => navigate(-1),
    goForward: () => navigate(1),
  };
};

interface RouterContext<TParameters> {
  match: {
    params: TParameters;
    pathname: string;
    url: string;
  };
  location: Location;
  history: HistoryNavigates & { location: Location };
}

export const useRouter = <TParameters extends { [k: string]: any }>(): RouterContext<TParameters> => {
  const location = useLocation();
  const history = useHistory(location);
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
  index?: boolean;
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

const mayTrimParentPath = (path: string, parentPath = "/") => {
  if (path[0] === "/" && parentPath[0] === "/") {
    if (parentPath.endsWith("/*")) {
      parentPath = parentPath.slice(0, parentPath.length - 2);
    }
    if (path.indexOf(parentPath) > -1) {
      if (parentPath === "/") {
        return path.slice(1);
      }
      return path.slice(parentPath.length + 1);
    }
    return path;
  }
  return path;
};

export const Route = ({ path, index, exact, sensitive, ...otherProps }: RouteProps) => {
  return (
    <Routes>
      <ReactRoute
        path={mayBeExactPath(path, exact)}
        index={index}
        caseSensitive={sensitive}
        element={<RouteWrap {...otherProps} />}
      />
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

const joinPaths = (paths: string[]): string => paths.join("/").replace(/\/\/+/g, "/");

// @deprecated Switch to Routes
export const Switch = ({ children, location }: SwitchProps) => {
  const { matches: parentMatches } = useContext(UNSAFE_RouteContext);

  const parentPath = parentMatches
    .map((routeMatch) => {
      return routeMatch && routeMatch.route;
    })
    .reduce((p, route) => {
      let parentPath = route.path ? route.path : "";
      if (parentPath.endsWith("/*")) {
        parentPath = parentPath.slice(0, parentPath.length - 2);
      }
      if (p == "") {
        return parentPath;
      }
      return joinPaths([p, parentPath]);
    }, "");

  return (
    <Routes location={location}>
      {Children.map(children, (e) => {
        if (isValidElement(e)) {
          if (e.type === Redirect) {
            const { from, to, push, state } = e.props as RedirectProps;

            return (
              <ReactRoute
                path={mayTrimParentPath(mayBeExactPath(from, !!from), parentPath)}
                element={<Navigate to={to} replace={!push} state={state} />}
              />
            );
          }

          const { path, index, exact, sensitive, ...otherProps } = e.props as RouteProps;

          return (
            <ReactRoute
              index={index}
              path={mayTrimParentPath(mayBeExactPath(path, exact), parentPath)}
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
