import { HTMLComment } from "@querycap/reactutils";
import { RequestActor } from "@querycap/request";
import { RequestActor as RequestActorOrigin } from "@reactorx/request";
import { AxiosRequestConfig } from "axios";
import { Dictionary, every, filter, forEach, map, some } from "lodash";
import { createContext, FunctionComponent, lazy, ReactNode, Suspense, useContext } from "react";

const AccessControlContext = createContext({
  permissions: {},
  attrs: {},
} as {
  permissions?: { [k: string]: boolean };
  attrs?: { [k: string]: string[] };
  strategies?: { [k: string]: boolean };
});

export const AccessControlProvider = AccessControlContext.Provider;

export const useAccessControl = () => useContext(AccessControlContext);

export interface TShouldRender {
  (permissions: Dictionary<boolean>, attrs: Dictionary<string[]>): boolean;

  scope: string;
  ac?: string;
}

export type ResolveShouldRender = (scope: string) => Promise<TShouldRender>;

export interface ShouldEnterResolver {
  // RequestActor
  requestConfig?: () => AxiosRequestConfig;
  resolveShouldRender?: ResolveShouldRender;
}

export interface AccessControlFunctionComponent<P = {}> extends FunctionComponent<P>, ShouldEnterResolver {}

const createShouldRenderBy = (requestActor: RequestActor, scope: string): TShouldRender => {
  const name = requestActor.name;

  const shouldRender: TShouldRender = (permissions: Dictionary<boolean>, _: Dictionary<string[]>) => {
    return permissions[name];
  };

  shouldRender.scope = scope;
  shouldRender.ac = name;

  return shouldRender;
};

export const displayPermissions = (joiner: string, ac: string[] = []): string => {
  if (ac.length === 0) {
    return "";
  }
  if (ac.length === 1) {
    return ac[0];
  }
  return `(${ac.join(joiner)})`;
};

const withAccessControl = (method: "some" | "every", ...deps: Array<ShouldEnterResolver>) => {
  const dependentResolveShouldRenders: ResolveShouldRender[] = [];

  forEach(deps, (c, i) => {
    if (!c) {
      throw new Error(`invalid access control parameter $${i}`);
    }

    if (c instanceof RequestActorOrigin) {
      dependentResolveShouldRenders.push((scope: string) => Promise.resolve(createShouldRenderBy(c, scope)));
      return;
    }

    if (c.resolveShouldRender) {
      dependentResolveShouldRenders.push(c.resolveShouldRender);
    }
  });

  const resolveShouldRender = (scope: string): Promise<TShouldRender> =>
    Promise.all(map(dependentResolveShouldRenders, (call) => call(scope))).then(
      (dependentShouldRenders = []): TShouldRender => {
        const shouldRender: any =
          method === "some"
            ? (permissions: Dictionary<boolean>, attrs: Dictionary<string[]>) => {
                return dependentShouldRenders.length == 0
                  ? true
                  : some(dependentShouldRenders, (shouldRender) =>
                      shouldRender ? shouldRender(permissions, attrs) : false,
                    );
              }
            : (permissions: Dictionary<boolean>, attrs: Dictionary<string[]>) => {
                return every(dependentShouldRenders, (shouldRender) =>
                  shouldRender ? shouldRender(permissions, attrs) : true,
                );
              };

        shouldRender.scope = scope;
        shouldRender.ac = displayPermissions(
          method === "some" ? " | " : " & ",
          filter(
            map(dependentShouldRenders, (shouldRender) => shouldRender.ac || ""),
            (v) => !!v,
          ),
        );

        return shouldRender;
      },
    );

  return function <TFn extends Function>(CompOrHook: TFn, isHook?: boolean, scope?: string) {
    if (isHook) {
      (CompOrHook as any).resolveShouldRender = resolveShouldRender;
      return CompOrHook;
    }

    const L = lazy(() =>
      resolveShouldRender(scope || "AccessControl").then((shouldRender) => {
        const ac = `@${shouldRender.scope || "Ac"}(${shouldRender?.ac || "any"})`;

        const AccessControl = ({ children }: { children: ReactNode }): JSX.Element | null => {
          const { permissions, attrs } = useAccessControl();

          return (
            <>
              <HTMLComment text={ac} />
              {shouldRender(permissions || {}, attrs || ({} as any)) && children}
            </>
          );
        };

        return {
          default: AccessControl,
        };
      }),
    );

    const AC = (props: any) => {
      return (
        <Suspense fallback={<></>}>
          <L>
            <CompOrHook {...props} />
          </L>
        </Suspense>
      );
    };

    AC.resolveShouldRender = resolveShouldRender;

    return (AC as any) as TFn;
  };
};

export const mustOneOfPermissions = (...deps: Array<ShouldEnterResolver>) => withAccessControl("some", ...deps);

export const mustAllOfPermissions = (...deps: Array<ShouldEnterResolver>) => withAccessControl("every", ...deps);
