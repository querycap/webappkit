import { filter, last, some } from "@querycap/lodash";
import {
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
import { v4 as uuidv4 } from "uuid";

const useId = () => useMemo(() => uuidv4(), []);

import { createPortal } from "react-dom";

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

const PortalCore = ({ children }: { children: ReactNode }) => {
  const { container, stack } = usePortalContext();

  const pid = useId();
  const elmRef = useRef<HTMLElement>(document.createElement("div"));

  useEffect(() => {
    const c = container ?? document.body;

    elmRef.current.setAttribute("data-portal-id", pid || "-");
    c.appendChild(elmRef.current);

    const unregister = stack.register(pid);

    return () => {
      c.removeChild(elmRef.current);
      unregister();
    };
  }, []);

  return (
    <PortalContext.Provider
      value={{
        stack: stack,
        container: elmRef.current,
        pid: pid,
      }}
    >
      {createPortal(children, elmRef.current)}
    </PortalContext.Provider>
  );
};

export const Portal = ({ children }: { children: ReactNode }) => {
  return canUseDOM ? <PortalCore>{children}</PortalCore> : null;
};

export const withPortal = <TProps extends {} = {}>(Comp: FunctionComponent<TProps & { children?: ReactNode }>) => {
  return ({ children, ...otherProps }: TProps & { children?: ReactNode }) => {
    return some(Children.toArray(children), (e) => isValidElement(e)) ? (
      <Portal>
        <Comp {...(otherProps as any)}>{children}</Comp>
      </Portal>
    ) : null;
  };
};
