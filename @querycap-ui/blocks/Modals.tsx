import { animated, cover, rgba, select, theme, useTransition } from "@querycap-ui/core/macro";
import { IconX } from "@querycap-ui/icons";
import { useOnExactlyClick, usePortalCloseOnEsc, withPortal } from "@querycap/uikit";
import { noop } from "lodash";
import React, { forwardRef, Fragment, ReactNode, Ref, useRef } from "react";

const withoutBubble = (callback: () => void) => (e: React.SyntheticEvent<any>) => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  callback();
};

export interface ModalBaseProps {
  onRequestClose?: () => void;
  children?: ReactNode;
}

export const ModalBase = withPortal(({ onRequestClose, children }: ModalBaseProps) => {
  usePortalCloseOnEsc(onRequestClose);

  return (
    <div
      role="dialog"
      tabIndex={-1}
      css={[
        cover(),
        {
          zIndex: 10,
          padding: "2em",
          overflowY: "auto",
        },
      ]}>
      {children}
    </div>
  );
});

export const ModalDialogBase = withPortal(({ onRequestClose, ...otherProps }: ModalBaseProps) => {
  usePortalCloseOnEsc(onRequestClose);

  return (
    <div
      {...otherProps}
      role="dialog"
      tabIndex={-1}
      css={[
        cover(),
        {
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      ]}
    />
  );
});

export const useModalTransition = (isOpen = false) =>
  useTransition(isOpen, null, {
    from: { opacity: 0, transform: "translate3d(0,30px,0) scale(1)" },
    enter: { opacity: 1, transform: "translate3d(0,0,0) scale(1)" },
    leave: { opacity: 0, transform: "translate3d(0,0,0) scale(0.9)" },
    config: { mass: 1, tension: 500, friction: 40 },
  });

export const ModalPanel = forwardRef(
  (
    { children, onRequestClose, ...otherProps }: ModalBaseProps & React.HTMLAttributes<HTMLDivElement>,
    ref: Ref<HTMLDivElement>,
  ) => (
    <div
      ref={ref}
      css={select()
        .position("relative")
        .minWidth(400)
        .padding("2.8em 3.2em")
        .borderRadius(theme.radii.normal)
        .backgroundColor(theme.state.backgroundColor)}
      {...otherProps}>
      {onRequestClose && (
        <a
          href="#"
          onClick={withoutBubble(onRequestClose)}
          css={select()
            .position("absolute")
            .top(0)
            .right(0)
            .minWidth(400)
            .padding("0.5em 1em")
            .opacity(0.5)
            .colorFill(theme.state.color)}>
          <IconX />
        </a>
      )}
      {children}
    </div>
  ),
);

export const ModalBackdrop = ({ onRequestClose, ...others }: React.HTMLAttributes<any> & ModalBaseProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useOnExactlyClick(ref, onRequestClose || noop, !onRequestClose);

  return (
    <div
      {...others}
      ref={ref as any}
      css={[
        cover(),
        {
          backgroundColor: `${rgba("#000", 0.5)}`,
          zIndex: -1,
        },
        {
          cursor: onRequestClose ? "pointer" : "default",
        },
      ]}
    />
  );
};

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
