import { createStore } from "@querycap/contexts";
import { useObservableEffect } from "@reactorx/core";
import { isUndefined, keys, omit, pick, values } from "@querycap/lodash";
import { ReactNode, useMemo, useRef } from "react";
import { flatMap, tap } from "rxjs/operators";
import { v4 as uuid } from "uuid";

export interface Confirmation {
  id: string;
  content: ReactNode;
  confirmed?: boolean;
}

export const confirmationStore = createStore<void, { [id: string]: Confirmation }>({
  group: "confirmation",
  initialState: {},
})({
  apply: (arg: Confirmation) => (confirmations) => ({
    ...confirmations,
    [arg.id]: arg,
  }),
  confirm:
    ({ id, confirmed }: { id: string; confirmed: boolean }) =>
    (confirmations) => ({
      ...confirmations,
      [id]: {
        ...(confirmations[id] || {}),
        confirmed,
      },
    }),
  destroy: (confirmationId: string) => (confirmations) => omit(confirmations, [confirmationId]),
});

export const useConfirm = () => {
  const [confirmations$, actions] = confirmationStore.useState();
  const callbackRefs = useRef({} as { [k: string]: (confirmed: boolean) => void });

  useObservableEffect(
    () =>
      confirmations$.pipe(
        flatMap((confirmations) => values(pick(confirmations, keys(callbackRefs.current)))),
        tap((confirmation) => {
          if (!isUndefined(confirmation.confirmed)) {
            const callback = callbackRefs.current[confirmation.id];
            callback && callback(confirmation.confirmed);
            delete callbackRefs.current[confirmation.id];
          }
        }),
      ),
    [],
  );

  return useMemo(() => {
    return (content: ReactNode, callback: (confirmed: boolean) => void) => {
      const id = uuid();

      callbackRefs.current[id] = callback;

      return actions.apply({
        id,
        content,
      });
    };
  }, []);
};
