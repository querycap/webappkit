import React, { Fragment } from "react";
import { animated } from "@querycap-ui/core";
import { ModalBaseProps, ModalBackdrop, ModalBase, ModalDialogBase, useModalTransition } from "./ModalBase";

export interface ModalProps extends ModalBaseProps {
  isOpen: boolean;
}

export const AnimatedModalBackdrop = animated(ModalBackdrop);

export const Modal = ({ isOpen, children, onRequestClose }: ModalProps) => {
  const transition = useModalTransition(isOpen);

  return (
    <ModalBase onRequestClose={onRequestClose}>
      {transition.map(
        ({ item, key, props: style }) =>
          item && (
            <Fragment key={key}>
              <AnimatedModalBackdrop onRequestClose={onRequestClose} style={{ opacity: style.opacity }} />
              <animated.div style={style}>{children}</animated.div>
            </Fragment>
          ),
      )}
    </ModalBase>
  );
};

export const ModalDialog = ({ isOpen, children, onRequestClose }: ModalProps) => {
  const transition = useModalTransition(isOpen);

  return (
    <ModalDialogBase onRequestClose={onRequestClose}>
      {transition.map(
        ({ item, key, props: style }) =>
          item && (
            <Fragment key={key}>
              <AnimatedModalBackdrop onRequestClose={onRequestClose} style={{ opacity: style.opacity }} />
              <animated.div style={style}>{children}</animated.div>
            </Fragment>
          ),
      )}
    </ModalDialogBase>
  );
};
