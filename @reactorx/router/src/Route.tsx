import React from "react";
import { IMatch, matchPath } from "./utils";
import { IRouterContext, RouterProvider, useRouter } from "./RouterContext";
import { shallowEqual } from "@reactorx/core";

export interface IRouteProps {
  path?: string | string[];
  exact?: boolean;
  strict?: boolean;
  sensitive?: boolean;
  component?: React.ComponentType<IRouterContext<any>>;
  location?: any;
  render?: (props: IRouterContext<any>) => React.ReactNode;
  children?: (props: IRouterContext<any>) => React.ReactNode;

  // from switch
  // don't use this for manual
  computedMatch?: IMatch<any>;
}

function renderChildren(props: IRouteProps, context: IRouterContext) {
  const { children, component, render } = props;
  const { match } = context;

  if (typeof children === "function") {
    return children(context);
  }

  if (component) {
    return match ? React.createElement(component, context) : null;
  }

  if (render) {
    return match ? render(context) : null;
  }

  return null;
}

function isMatchEqual(match: IMatch<any>, nextMatch: IMatch<any>): boolean {
  if (match.url !== nextMatch.url) {
    return false;
  }
  if (match.path !== nextMatch.path) {
    return false;
  }
  if (match.isExact !== nextMatch.isExact) {
    return false;
  }
  return shallowEqual(match.params, nextMatch.params);
}

function computeRouteMatch(
  { computedMatch, location, path, strict, exact, sensitive }: IRouteProps,
  context: IRouterContext<any>,
) {
  if (computedMatch) {
    return computedMatch;
  }

  if (path) {
    const nextMatch = matchPath((location || context.location).pathname, {
      path,
      strict,
      exact,
      sensitive,
    });

    if (nextMatch && isMatchEqual(nextMatch, context.match)) {
      return context.match;
    }

    return nextMatch;
  }

  return context.match;
}

export const Route = (props: IRouteProps) => {
  const context = useRouter();
  const match = computeRouteMatch(props, context);

  const nextContext = {
    ...context,
    location: props.location || context.location,
    match: match!,
  };

  return <RouterProvider value={nextContext}>{renderChildren(props, nextContext)}</RouterProvider>;
};
