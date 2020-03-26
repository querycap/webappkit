import { animated, select, theme, useTransition } from "@querycap-ui/core/macro";
import { Portal } from "@querycap/uikit";
import { useObservableEffect } from "@reactorx/core";
import React from "react";
import { timer } from "rxjs";
import { tap } from "rxjs/operators";
import { AlertCard, AlertProps } from "./Alert";

export interface Message {
  type: AlertProps["type"];
  id: string;
  summary: string;
  description?: string;
}

const Notification = ({
  closeRequestIn,
  msg,
  onRequestClose,
}: {
  msg: Message;
  closeRequestIn?: number;
  onRequestClose: (id: string) => void;
}) => {
  useObservableEffect(() => {
    if (!closeRequestIn) {
      return;
    }
    return timer(closeRequestIn * 1000).pipe(
      tap(() => {
        onRequestClose(msg.id);
      }),
    );
  }, []);

  return (
    <AlertCard type={msg.type} onRequestClose={() => onRequestClose(msg.id)}>
      {msg.summary}
    </AlertCard>
  );
};
export const NotificationHub = ({
  messages,
  closeRequestIn,
  onRequestClose,
}: {
  messages: Message[];
  // s
  closeRequestIn?: number;
  onRequestClose: (id: string) => void;
}) => {
  const transitions = useTransition(messages, (m) => m.id, {
    from: { transform: "translate3d(0,-100%,0)", opacity: 1 },
    enter: { transform: "translate3d(0,0,0)", opacity: 1 },
    leave: { transform: "translate3d(0,-100%,0)", opacity: 0 },
  });

  return (
    <>
      {transitions.map(({ item, key, props: style }) => (
        <Portal key={key}>
          <animated.div
            style={style}
            css={select().position("absolute").top(0).left(0).right(0).zIndex(10).pointerEvents("none")}>
            <div css={select().maxWidth(320).margin("0 auto").pointerEvents("auto").padding(theme.space.s2)}>
              <Notification msg={item} closeRequestIn={closeRequestIn} onRequestClose={onRequestClose} />
            </div>
          </animated.div>
        </Portal>
      ))}
    </>
  );
};
