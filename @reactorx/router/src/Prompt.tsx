import { createContext, useContext, useEffect, useMemo, useRef, ReactNode } from "react";

import { UNSAFE_NavigationContext } from "react-router";
import { Blocker, Transition, History } from "history";

export interface IPromptProps {
  message: string;
  when?: boolean;
}

export function useBlocker(blocker: Blocker, when = true): void {
  const navigator = useContext(UNSAFE_NavigationContext).navigator;

  useEffect(() => {
    if (!when) return;

    const unblock = (navigator as any as History).block((tx: Transition) => {
      const autoUnblockingTx = {
        ...tx,
        retry() {
          // Automatically unblock the transition so it can play all the way
          // through before retrying it. TODO: Figure out how to re-enable
          // this block if the transition is cancelled for some reason.
          unblock();
          tx.retry();
        },
      };

      blocker(autoUnblockingTx);
    });

    return unblock;
  }, [navigator, blocker, when]);
}

export type GetUserConfirmation = (message: string, callback: (ret: boolean) => void) => void;

const GetUserConfirmationContext = createContext({
  getUserConfirmation: (_: any, callback: (ret: boolean) => void) => callback(true),
});

export const PromptUserConfirmation = ({
  getUserConfirmation,
  children,
}: {
  getUserConfirmation: GetUserConfirmation;
  children?: ReactNode;
}) => {
  return (
    <GetUserConfirmationContext.Provider value={{ getUserConfirmation }}>
      {children}
    </GetUserConfirmationContext.Provider>
  );
};

export const Prompt = ({ message, when = true }: IPromptProps) => {
  const { getUserConfirmation } = useContext(GetUserConfirmationContext);

  const msgRef = useRef(message);
  msgRef.current = message;

  const blocker = useMemo(() => {
    return (tx: Transition) => {
      getUserConfirmation(message, (ret) => {
        ret && tx.retry();
      });
    };
  }, []);

  useBlocker(blocker, when);

  return null;
};
