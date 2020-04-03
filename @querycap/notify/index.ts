import { Actor, useConn, useObservable, useStore } from "@reactorx/core";
import { omit } from "lodash";
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

const InfoActor = Actor.of("messages");

export const notify = InfoActor.named<Omit<Msg, "id">>("message").effectOn<MsgSet>(
  InfoActor.group,
  (messages, actor) => {
    const message = {
      ...actor.arg,
      id: uuid(),
    };

    return {
      ...messages,
      [message.id]: message,
    };
  },
);

export const closeMsg = InfoActor.named<string>("message/close").effectOn<MsgSet>(
  InfoActor.group,
  (messages, actor) => {
    return omit(messages, [actor.arg]);
  },
);

export const useNotify = () => {
  const store$ = useStore();

  return useMemo(() => {
    return (type: keyof typeof Type, summary: string, description?: string) => {
      notify
        .with({
          type,
          summary,
          description,
        })
        .invoke(store$);
    };
  }, []);
};

export const useMessages$ = () => {
  return useConn(useStore(), (state: any = {}): MsgSet => state[InfoActor.group] || {}, []);
};

export const useMessages = () => {
  return useObservable(useMessages$());
};
