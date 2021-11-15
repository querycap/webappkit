import {
  forwardRef,
  MouseEvent,
  AnchorHTMLAttributes,
  useCallback,
  HTMLAttributeAnchorTarget,
  CSSProperties,
} from "react";
import { createPath, To } from "history";
import { useHref, useLocation, useNavigate, useResolvedPath } from "react-router";

const isModifiedEvent = (event: MouseEvent) => event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;

export function useLinkClickHandler<E extends Element = HTMLAnchorElement>(
  to: To,
  {
    target,
    replace: replaceProp,
    state,
  }: {
    target?: HTMLAttributeAnchorTarget;
    replace?: boolean;
    state?: any;
  } = {},
): (event: MouseEvent<E>) => void {
  const navigate = useNavigate();
  const location = useLocation();
  const path = useResolvedPath(to);

  return useCallback(
    (event: MouseEvent<E>) => {
      if (
        event.button === 0 && // Ignore everything but left clicks
        (!target || target === "_self") && // Let browser handle "target=_blank" etc.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        !isModifiedEvent(event as any) // Ignore clicks with modifier keys
      ) {
        event.preventDefault();

        // If the URL hasn't changed, a regular <a> will do a replace instead of
        // a push, so do the same here.
        const replace = !!replaceProp || createPath(location) === createPath(path);

        navigate(to, { replace, state });
      }
    },
    [location, navigate, path, replaceProp, state, target, to],
  );
}

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  reloadDocument?: boolean;
  replace?: boolean;
  state?: any;
  to: To;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function LinkWithRef(
  { onClick, reloadDocument, replace = false, state, target, to, ...rest },
  ref,
) {
  const href = useHref(to);

  const internalOnClick = useLinkClickHandler(to, { replace, state, target });

  return (
    <a
      {...rest}
      href={href}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        if (onClick) onClick(event);
        if (!event.defaultPrevented && !reloadDocument) {
          internalOnClick(event);
        }
      }}
      ref={ref}
      target={target}
    />
  );
});

export interface NavLinkProps extends Omit<LinkProps, "className" | "style"> {
  caseSensitive?: boolean;
  className?: string | ((props: { isActive: boolean }) => string);
  end?: boolean;
  style?: CSSProperties | ((props: { isActive: boolean }) => CSSProperties);
}

/**
 * A <Link> wrapper that knows if it's "active" or not.
 */
export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLinkWithRef(
  {
    "aria-current": ariaCurrentProp = "page",
    caseSensitive = false,
    className: classNameProp = "",
    end = false,
    style: styleProp,
    to,
    ...rest
  },
  ref,
) {
  const location = useLocation();
  const path = useResolvedPath(to);

  let locationPathname = location.pathname;
  let toPathname = path.pathname;
  if (!caseSensitive) {
    locationPathname = locationPathname.toLowerCase();
    toPathname = toPathname.toLowerCase();
  }

  const isActive =
    locationPathname === toPathname ||
    (!end && locationPathname.startsWith(toPathname) && locationPathname.charAt(toPathname.length) === "/");

  const ariaCurrent = isActive ? ariaCurrentProp : undefined;

  let className: string;
  if (typeof classNameProp === "function") {
    className = classNameProp({ isActive });
  } else {
    // If the className prop is not a function, we use a default `active`
    // class for <NavLink />s that are active. In v5 `active` was the default
    // value for `activeClassName`, but we are removing that API and can still
    // use the old default behavior for a cleaner upgrade path and keep the
    // simple styling rules working as they currently do.
    className = [classNameProp, isActive ? "active" : null].filter(Boolean).join(" ");
  }

  const style = typeof styleProp === "function" ? styleProp({ isActive }) : styleProp;

  return <Link {...rest} aria-current={ariaCurrent} className={className} ref={ref} style={style} to={to} />;
});
