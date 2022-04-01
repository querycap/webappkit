import { displayPermissions, ShouldEnterResolver, TShouldRender, useAccessControl } from "@querycap/access";
import { generatePath, useRouter } from "@reactorx/router";
import { Dictionary, forEach, map, reduce, some, assign } from "@querycap/lodash";
import { Children, cloneElement, lazy, ReactNode, Suspense, useEffect, useMemo } from "react";
import { RouteTree } from "./RouteTree";

const resolveShouldRender = (route: RouteTree): ((scope: string) => Promise<TShouldRender>) => {
  if (!route.state) {
    route.state = {};
  }

  if ((route.state as any).resolveShouldRender) {
    return (route.state as any).resolveShouldRender;
  }

  const resolve = (scope: string): Promise<TShouldRender> => {
    if (route.Component) {
      if ((route.Component as ShouldEnterResolver).resolveShouldRender) {
        // route Component 自己已经定义，则直接使用
        return (route.Component as ShouldEnterResolver).resolveShouldRender!(scope);
      }
    }

    // 找子路由
    const subShouldRenders: Array<(scope: string) => Promise<TShouldRender>> = [];

    let hasIndex = false;

    forEach(route.routes, (subRoute) => {
      // 辅助类不处理
      if (subRoute.Component && (subRoute.Component as any).assistant) {
        return;
      }

      // 无 index 路由找其他路由
      // 否则使用子路由权限
      if (!hasIndex) {
        subShouldRenders.push(resolveShouldRender(subRoute));
      }

      if (subRoute.exact) {
        hasIndex = true;
      }
    });

    if (subShouldRenders.length !== 0) {
      return Promise.all(map(subShouldRenders, (call) => call(scope))).then((subShouldRenders) => {
        const needPermissions: string[] = [];

        forEach(subShouldRenders, (shouldRender) => {
          needPermissions.push(shouldRender && shouldRender.ac ? shouldRender.ac : "any");
        });

        const shouldRender = (permissions: Dictionary<boolean>, context: Dictionary<string[]>) =>
          some(subShouldRenders, (shouldRender) => {
            return shouldRender ? shouldRender(permissions, context) : true;
          });

        shouldRender.ac = displayPermissions(" | ", needPermissions);
        shouldRender.scope = scope;

        return shouldRender as TShouldRender;
      });
    }

    return Promise.resolve(
      assign(() => true, {
        scope: scope,
      }),
    );
  };

  (route.state as any).resolveShouldRender = resolve;

  return resolve;
};

export const RBACShouldEnter = ({ children, route }: { children: ReactNode; route: RouteTree }) => {
  const C = useMemo(() => {
    return lazy(() => {
      if (!route.state) {
        route.state = {};
      }

      if (!(route.state as any).resolveShouldRender) {
        (route.state as any).resolveShouldRender = resolveShouldRender(route);
      }

      return (route.state as any).resolveShouldRender.then((shouldRender: TShouldRender) => {
        const RBACShouldEnter = ({ children }: { children: ReactNode }) => {
          const { permissions, attrs } = useAccessControl();

          if (!shouldRender || shouldRender(permissions || {}, attrs || ({} as any))) {
            return (
              <>
                {cloneElement(Children.only(children as any), {
                  ["data-access-control"]: shouldRender?.ac,
                })}
              </>
            );
          }

          return null;
        };

        return {
          default: RBACShouldEnter,
        };
      });
    });
  }, []);

  return (
    <Suspense fallback={<></>}>
      <C>{children}</C>
    </Suspense>
  );
};

export const indexAutoRedirectByRBAC = () => {
  const AutoRedirectByRBAC = ({ route }: { route: RouteTree }) => {
    const { history, match } = useRouter();
    const { permissions, attrs } = useAccessControl();

    useEffect(() => {
      if (!route.parent) {
        return;
      }

      void reduce(
        route.parent.routes,
        (p, subRoute) => {
          return p.then((prev) => {
            // 处理串行
            if (prev.shouldRender) {
              return prev;
            }

            // 辅助类，redirect 等跳过
            if (subRoute.Component && (subRoute.Component as any).assistant) {
              return prev;
            }

            return resolveShouldRender(subRoute)("").then((shouldRender: TShouldRender) => ({
              path: generatePath(subRoute.path, match.params),
              shouldRender: shouldRender(permissions || {}, attrs || ({} as any)),
            }));
          });
        },
        Promise.resolve({ path: "", shouldRender: false }),
      ).then(({ path }) => {
        if (path) {
          console.log(`automate navigate to ${path}`);
          history.replace(path);
        }
      });
    }, []);

    return null;
  };

  AutoRedirectByRBAC.assistant = true;

  return RouteTree.index().withComp(AutoRedirectByRBAC);
};
