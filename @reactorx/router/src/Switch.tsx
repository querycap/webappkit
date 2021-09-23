import { Location, LocationDescriptorObject } from "history";
import { ReactNode, ReactElement, Children, cloneElement, isValidElement } from "react";
import { IMatch, matchPath } from "./utils";
import { useRouter } from "./RouterContext";
import { IRouteProps } from "./Route";
import { IRedirectProps } from "./Redirect";

export interface ISwitchProps {
  children: ReactNode;
  location?: LocationDescriptorObject;
}

export const Switch = (props: ISwitchProps) => {
  const router = useRouter();

  const location = (props.location || router.location) as Location;

  let match: IMatch<any> | null = null;
  let element: ReactElement<any> | undefined;

  Children.forEach(props.children, (child) => {
    if (match == null && isValidElement(child)) {
      element = child;

      const path = (child.props as IRouteProps).path || (child.props as IRedirectProps).from;

      match = path ? matchPath(location.pathname, { ...child.props, path }) : router.match;
    }
  });

  return !!match && !!element ? cloneElement(element, { location, computedMatch: match }) : null;
};
