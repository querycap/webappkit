import { Dialog, Modal, ModalDialog } from "@querycap-ui/blocks";
import { theme } from "@querycap-ui/core/macro";
import { Button } from "@querycap-ui/form-controls";
import { Stack } from "@querycap-ui/layouts";
import { useToggle } from "@querycap/uikit";
import React from "react";

const ModalDemo = () => {
  const [isOpen, show, hide] = useToggle();

  return (
    <div>
      <Modal isOpen={isOpen} onRequestClose={hide}>
        12313123
      </Modal>
      <Button onClick={show}>click modal</Button>
    </div>
  );
};

const DialogDemo = () => {
  const [isOpen, show, hide] = useToggle();

  return (
    <div>
      <ModalDialog isOpen={isOpen} onRequestClose={hide}>
        <Dialog title={"对话框"} onRequestClose={hide} onRequestConfirm={hide}>
          文字描述
          <ModalDemo />
        </Dialog>
      </ModalDialog>
      <Button onClick={show}>click dialog</Button>
    </div>
  );
};

export const Modals = () => (
  <Stack spacing={theme.space.s2}>
    <ModalDemo />
    <DialogDemo />
  </Stack>
);
