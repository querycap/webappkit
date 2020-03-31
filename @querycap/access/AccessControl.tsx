import { RequestActor } from "@querycap/request";
import { RequestActor as RequestActorOrigin } from "@reactorx/request";
import { AxiosRequestConfig } from "axios";
import { Dictionary, every, filter, forEach, map, some } from "lodash";
import React, {
  Children,
  cloneElement,
  createContext,
  FunctionComponent,
  lazy,
  ReactNode,
  Suspense,
  useContext,
} from "react";

const AccessControlContext = createContext({
  permissions: {},
  attrs: {},
} as {
  permissions?: { [k: string]: boolean };
  attrs?: { [k: string]: string[] };
});

export const AccessControlProvider = AccessControlContext.Provider;

export const useAccessControl = () => useContext(AccessControlContext);

export interface TShouldRender {
  (permissions: Dictionary<boolean>, attrs: Dictionary<string[]>): boolean;

  ac?: string;
}

export type ResolveShouldRender = () => Promise<TShouldRender>;

export interface ShouldEnterResolver {
  // RequestActor
  requestConfig?: () => AxiosRequestConfig;
  resolveShouldRender?: ResolveShouldRender;
}

export interface AccessControlFunctionComponent<P = {}> extends FunctionComponent<P>, ShouldEnterResolver {}

function createShouldRenderBy(requestActor: RequestActor): TShouldRender {
  const name = requestActor.name;

  const shouldRender: TShouldRender = (permissions: Dictionary<boolean>, _: Dictionary<string[]>) => {
    return permissions[name];
  };

  shouldRender.ac = name;

  return shouldRender;
}

function withAccessControl(method: "some" | "every", ...deps: Array<ShouldEnterResolver>) {
  const dependentResolveShouldRenders: ResolveShouldRender[] = [];

  forEach(deps, (c, i) => {
    if (!c) {
      throw new Error(`invalid access control parameter $${i}`);
    }

    if (c instanceof RequestActorOrigin) {
      dependentResolveShouldRenders.push(() => Promise.resolve(createShouldRenderBy(c)));
      return;
    }

    if (c.resolveShouldRender) {
      dependentResolveShouldRenders.push(c.resolveShouldRender);
    }
  });

  const resolveShouldRender = (): Promise<TShouldRender> =>
    Promise.all(map(dependentResolveShouldRenders, (call) => call())).then((dependentShouldRenders) => {
      const shouldRender: TShouldRender =
        method === "some"
          ? (permissions: Dictionary<boolean>, attrs: Dictionary<string[]>) => {
              return some(dependentShouldRenders, (shouldRender) =>
                shouldRender ? shouldRender(permissions, attrs) : false,
              );
            }
          : (permissions: Dictionary<boolean>, attrs: Dictionary<string[]>) => {
              return every(dependentShouldRenders, (shouldRender) =>
                shouldRender ? shouldRender(permissions, attrs) : true,
              );
            };

      shouldRender.ac = displayPermissions(
        method === "some" ? " | " : " & ",
        filter(
          map(dependentShouldRenders, (shouldRender) => shouldRender.ac || ""),
          (v) => !!v,
        ),
      );

      return shouldRender;
    });

  return function <TFn extends Function>(CompOrHook: TFn, isHook?: boolean) {
    if (isHook) {
      (CompOrHook as any).resolveShouldRender = resolveShouldRender;
      return CompOrHook;
    }

    const L = lazy(() =>
      resolveShouldRender().then((shouldRender) => {
        function Ac({ children }: { children: ReactNode }): JSX.Element | null {
          const { permissions, attrs } = useAccessControl();

          if (shouldRender(permissions || {}, attrs || ({} as any))) {
            return (
              <>
                {cloneElement(Children.only(children as any), {
                  ["data-access-control"]: shouldRender?.ac,
                })}
              </>
            );
          }

          return null;
        }

        Ac.displayName = `Ac<${shouldRender.ac}>`;

        return {
          default: Ac,
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
}

export function mustOneOfPermissions(...deps: Array<ShouldEnterResolver>) {
  return withAccessControl("some", ...deps);
}

export function mustAllOfPermissions(...deps: Array<ShouldEnterResolver>) {
  return withAccessControl("every", ...deps);
}

export function displayPermissions(joiner: string, ac: string[] = []): string {
  if (ac.length === 0) {
    return "";
  }
  if (ac.length === 1) {
    return ac[0];
  }
  return `(${ac.join(joiner)})`;
}
