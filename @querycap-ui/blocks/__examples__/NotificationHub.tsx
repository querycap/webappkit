import { Button } from "@querycap-ui/form-controls";
import { Message, NotificationHub } from "@querycap-ui/blocks";
import React, { useState } from "react";
import { v4 as uuid } from "uuid";

export const NotificationHubs = () => {
  const [messages, setMessages] = useState([] as Message[]);

  return (
    <>
      <Button
        onClick={() => {
          setMessages((messages) => [
            ...messages,
            {
              id: `${uuid()}`,
              type: "error",
              summary: "错误",
            },
          ]);
        }}>
        notify
      </Button>
      <NotificationHub
        closeRequestIn={3}
        messages={messages}
        onRequestClose={(id: string) => setMessages((messages) => messages.filter((m) => m.id !== id))}
      />
    </>
  );
};
