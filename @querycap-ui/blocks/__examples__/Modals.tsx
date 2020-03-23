import { Modal, ModalDialog } from "@querycap-ui/blocks";
import { Button } from "@querycap-ui/form-controls";
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
        <div>12313123</div>
        <ModalDemo />
      </ModalDialog>
      <Button onClick={show}>click dialog</Button>
    </div>
  );
};

export const Modals = () => (
  <div>
    <ModalDemo />
    <DialogDemo />
  </div>
);
