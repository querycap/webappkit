import { IRouteProps, IRouterContext, Redirect, Route, Switch } from "@reactorx/router";
import { assign, startsWith } from "lodash";
import React, { ComponentType, createContext, Fragment, lazy, Suspense, useContext } from "react";

export interface IRouteTree {
  exact?: boolean;
  pathname?: string;

  before?: ComponentType<any> | null;
  icon?: ComponentType<any>;
  title?: ComponentType<any>;
  main?: ComponentType<any>;

  parent?: RouteTree;
  routes?: RouteTree[];

  state?: { [k: string]: any };
}

export class RouteTree implements IRouteTree {
  exact: boolean | undefined;
  pathname: string | undefined;

  routes: RouteTree[];
  parent: RouteTree | undefined;

  state?: { [k: string]: any } = {};

  before?: ComponentType<any> | null;

  icon?: ComponentType<any>;
  title?: ComponentType<any>;
  main?: ComponentType<any>;

  static createTitle = (title: any) => () => <span>{title}</span>;

  static createRedirect = (to: string) =>
    assign(
      ({ match }: IRouterContext<any>) => {
        return <Redirect to={startsWith(to, "/") ? to : `${match.url}/${to}`} />;
      },
      {
        assistant: true,
      },
    );

  static createElement(Comp?: ComponentType, props?: object) {
    if (Comp) {
      return <Comp {...props} />;
    }
    return null;
  }

  static path = (p: string, exact = false) =>
    new RouteTree({
      pathname: p,
      exact,
    });

  static index = (exact = true) =>
    new RouteTree({
      exact,
    });

  constructor(route: IRouteTree) {
    this.pathname = route.pathname;
    this.exact = route.exact;
    this.before = route.before;
    this.title = route.title;
    this.icon = route.icon;
    this.main = route.main;

    this.parent = route.parent;
    this.routes = (route.routes || []).map((subRouteTree) => subRouteTree.setParent(this));

    this.state = route.state;
  }

  private set(key: keyof RouteTree, value: any) {
    return new RouteTree(assign({}, this, { [key]: value }));
  }

  private setParent(route: RouteTree) {
    return this.set("parent", route);
  }

  withRoutes(...routes: RouteTree[]) {
    return this.set("routes", this.routes.concat(...routes));
  }

  withComp(Comp: ComponentType<any>) {
    return this.set("main", Comp);
  }

  withState(state: { [k: string]: any }) {
    return this.set("state", state);
  }

  withDynamic(loadComp: () => Promise<{ default: ComponentType<any> }>, fallback = <></>) {
    const Comp = lazy(loadComp);

    return this.set(
      "main",
      assign(
        (props: any) => (
          <Suspense fallback={fallback}>
            <Comp {...props} />
          </Suspense>
        ),
        {
          resolveShouldRender: () =>
            loadComp().then((m: any) => {
              if (m.default.resolveShouldRender) {
                return m.default.resolveShouldRender();
              }
              return () => true;
            }),
        },
      ),
    );
  }

  withTitle(Comp: string | ComponentType<any>) {
    return this.set("title", typeof Comp === "string" ? RouteTree.createTitle(Comp) : Comp);
  }

  withIcon(Icon: ComponentType<any>) {
    return this.set("icon", Icon);
  }

  persistentShouldRender(render: ComponentType<any>) {
    return this.set(
      "before",
      assign(render, {
        persistent: true,
      }),
    );
  }

  shouldRender(render: ComponentType<any>) {
    return this.set("before", render);
  }

  get Component() {
    return this.main;
  }

  get Title() {
    return this.title;
  }

  get Icon() {
    return this.icon;
  }

  get ShouldRender() {
    if (typeof this.before === "undefined") {
      const parents = this.parents();

      let n = parents.length;

      this.before = null;

      while (n--) {
        const p = parents[n];

        if (p.before && (p.before as any).persistent) {
          this.before = p.before;
          break;
        }
      }
    }

    return this.before;
  }

  render(render: () => JSX.Element | null, key?: any): JSX.Element | null {
    if (this.ShouldRender) {
      const ShouldRender = this.ShouldRender;

      return (
        <ShouldRender key={key} route={this}>
          {render()}
        </ShouldRender>
      );
    }

    return <Fragment key={key}>{render()}</Fragment>;
  }

  parents() {
    const parents: RouteTree[] = [];

    let parent = this.parent;

    while (parent) {
      parents.unshift(parent);
      parent = parent.parent;
    }

    return parents;
  }

  get path(): string {
    let pathname = this.pathname;
    let parent = this.parent;

    if (!pathname) {
      if (parent) {
        return parent.path;
      }
      return "";
    }

    if (pathname === "*") {
      return "(.*)";
    }

    if (startsWith(pathname, "/")) {
      return pathname;
    }

    while (parent && !pathname.startsWith("/")) {
      const parentPathname = parent.path;
      pathname = parentPathname ? `${parentPathname === "/" ? "" : parentPathname}/${pathname}` : pathname;
      parent = parent.parent;
    }

    return pathname;
  }

  get AvailableTitle(): ComponentType<any> {
    let parent = this.parent;
    let title: ComponentType<any> | undefined = this.Title;

    while (parent && !title) {
      title = parent.Title;
      parent = parent.parent;
    }

    if (!title) {
      return function NoTitle() {
        return <span />;
      };
    }

    return title;
  }
}

export interface ISwitchByRouteProps {
  route: RouteTree;
}

export interface IRouteEnhanceProps extends IRouteProps, ISwitchByRouteProps {
  defaultComponent?: React.ComponentType;
}

export const SwitchByRoute = ({ route }: ISwitchByRouteProps): JSX.Element => {
  return (
    <Switch>
      {route.routes.map((subRoute: RouteTree, idx: number) => {
        return <RouteEnhance key={idx} route={subRoute} exact={subRoute.exact} path={subRoute.path} />;
      })}
    </Switch>
  );
};

const MatchedRouteContext = createContext({ route: null } as { route: RouteTree | null });

export const MatchedRouteProvider = MatchedRouteContext.Provider;

export function useMatchedRoute() {
  return useContext(MatchedRouteContext).route!;
}

export function RouteEnhance(props: IRouteEnhanceProps) {
  const { route, defaultComponent = SwitchByRoute } = props;

  const Comp = route.Component || defaultComponent;

  return (
    <MatchedRouteContext.Provider value={{ route: route }}>
      <Route {...props} render={(props) => route.render(() => <Comp {...props} route={route} />)} />
    </MatchedRouteContext.Provider>
  );
}
