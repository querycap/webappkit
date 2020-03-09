import { Actor, useConn, useObservable, useStore } from "@reactorx/core";
import { omit } from "lodash";
import { useMemo } from "react";

export enum Type {
  success = "success",
  info = "info",
  danger = "danger",
  warning = "warning",
}

export interface IMsg {
  summary: string;
  description?: string;
}

export interface IMessage {
  id: number;
  type: keyof typeof Type;
  msg: IMsg;
}

interface IMessages {
  [key: string]: IMessage;
}

const InfoActor = Actor.of("messages");

export interface IMsgWithType extends IMsg {
  type?: keyof typeof Type;
}

export const notify = InfoActor.named<IMsgWithType>("message").effectOn<IMessages>(
  InfoActor.group,
  (messages, actor) => {
    const message = {
      id: Date.now(),
      type: actor.name as any,
      msg: actor.arg,
    };

    return {
      ...messages,
      [message.id]: message,
    };
  },
);

export const notifyClose = InfoActor.named<number>("message/close").effectOn<IMessages>(
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
  return useConn(useStore(), (state: any = {}): IMessages => state[InfoActor.group] || {}, []);
};

export const useMessages = () => {
  return useObservable(useMessages$());
};
