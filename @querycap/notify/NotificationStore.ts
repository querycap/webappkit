import { createStore } from "@querycap/contexts";
import { useObservable } from "@reactorx/core";
import { omit } from "@querycap/lodash";
import { useMemo } from "react";
import { v4 as uuid } from "uuid";

export enum Type {
  success = "success",
  info = "info",
  error = "error",
  warning = "warning",
}

export interface MsgInfo {
  summary: string;
  description?: string;
}

export interface Msg extends MsgInfo {
  id: string;
  type: keyof typeof Type;
}

export interface MsgSet {
  [id: string]: Msg;
}

export const notificationStore = createStore<void, MsgSet>({
  group: "notification",
})({
  notify: (arg: Omit<Msg, "id">) => (notifications) => {
    const notification = {
      ...arg,
      id: uuid(),
    };

    return {
      ...notifications,
      [notification.id]: notification,
    };
  },
  close: (id: string) => (notifications) => omit(notifications, id),
});

export const useNotify = () => {
  const [, actions] = notificationStore.useState();

  return useMemo(() => {
    return (type: keyof typeof Type, summary: string, description?: string) => {
      actions.notify({
        type,
        summary,
        description,
      });
    };
  }, []);
};

export const useMessages$ = () => {
  const [state$] = notificationStore.useState();
  return state$;
};

export const useMessages = () => {
  return useObservable(useMessages$());
};
