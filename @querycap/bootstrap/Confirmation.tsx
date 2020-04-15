import { filter, map } from "lodash";
import React, { createContext, ReactNode, useContext, useMemo } from "react";
import { BehaviorSubject } from "rxjs";
import { v4 as uuid } from "uuid";

export interface Confirmation {
  id: string;
  content: ReactNode;
  confirmed?: boolean;
}

export const useNewConfirmContext = () => {
  return useMemo(() => {
    const callbacks: { [k: string]: (confirmed: boolean) => void } = {};

    const confirmations$ = new BehaviorSubject<Confirmation[]>([]);

    const destroy = (promptId: string) => {
      const next = filter(confirmations$.value, ({ id }) => promptId !== id);

      confirmations$.next(next);
    };

    const confirm = (promptId: string, confirmed: boolean) => {
      const next = map(confirmations$.value, (c: Confirmation) => {
        if (promptId === c.id) {
          return {
            ...c,
            confirmed,
          };
        }
        return c;
      });

      confirmations$.next(next);

      if (callbacks[promptId]) {
        callbacks[promptId](confirmed);
        delete callbacks[promptId];
      }
    };

    const applyConfirmation = (content: ReactNode, callback: (confirmed: boolean) => void) => {
      const id = uuid();

      callbacks[id] = callback;

      const next = [
        ...(confirmations$.value || []),
        {
          id,
          content,
        } as Confirmation,
      ];

      confirmations$.next(next);
    };

    return {
      confirmations$,
      confirm,
      destroy,
      applyConfirmation,
    };
  }, []);
};

const ConfirmContext = createContext<ReturnType<typeof useNewConfirmContext>>({} as any);

export const useConfirmContext = () => useContext(ConfirmContext);

export const useConfirm = () => {
  return useConfirmContext().applyConfirmation;
};

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const ctx = useNewConfirmContext();
  return <ConfirmContext.Provider value={ctx}>{children}</ConfirmContext.Provider>;
};
