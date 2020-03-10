import { filter, last, some } from "lodash";
import React, {
  Children,
  createContext,
  FunctionComponent,
  isValidElement,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { v4 as uuid } from "uuid";

const createStackMgr = () => {
  let stack: string[] = [];

  return {
    top: () => last(stack),
    register: (pid: string) => {
      stack.push(pid);

      return () => {
        stack = filter(stack, (id) => id != pid);
      };
    },
  };
};

const PortalContext = createContext({
  stack: createStackMgr(),
  container: null as null | HTMLElement,
  // portal id
  pid: "",
});

export const usePortalContext = () => useContext(PortalContext);

// eslint-disable-next-line @typescript-eslint/unbound-method
const canUseDOM = !!(typeof globalThis !== "undefined" && globalThis.document && globalThis.document.createElement);

export const Portal = ({ pid = uuid(), children }: { pid?: string; children: ReactNode }) => {
  const { container, stack } = usePortalContext();

  const elmRef = useRef<HTMLElement | undefined>(undefined);

  useMemo(() => {
    if (canUseDOM) {
      elmRef.current = document.createElement("div");
      elmRef.current.setAttribute("data-portal-id", pid || "-");
    }
  }, []);

  useEffect(() => {
    if (!elmRef.current) {
      return;
    }

    const c = container || document.body;

    c.appendChild(elmRef.current);

    const unregister = stack.register(pid);

    return () => {
      c.removeChild(elmRef.current!);
      unregister();
      elmRef.current = undefined;
    };
  }, []);

  if (!elmRef.current) {
    return null;
  }

  return (
    <PortalContext.Provider
      value={{
        stack: stack,
        container: elmRef.current,
        pid: pid,
      }}>
      {createPortal(children, elmRef.current)}
    </PortalContext.Provider>
  );
};

export const withPortal = <TProps extends any = {}>(Comp: FunctionComponent<TProps & { children?: ReactNode }>) => {
  return ({ children, ...otherProps }: TProps & { children?: ReactNode }) => {
    return some(Children.toArray(children), (e) => isValidElement(e)) ? (
      <Portal>
        <Comp {...(otherProps as any)}>{children}</Comp>
      </Portal>
    ) : null;
  };
};
