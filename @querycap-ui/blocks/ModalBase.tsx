import { cover, rgba, selector, themes, useTransition } from "@querycap-ui/core";
import { IconX } from "@querycap-ui/icons";
import { useOnExactlyClick, usePortalCloseOnEsc, withPortal } from "@querycap/uikit";
import { noop } from "lodash";
import React, { forwardRef, ReactNode, Ref, useRef } from "react";

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
      css={selector()
        .position("relative")
        .minWidth(400)
        .padding("2.8em 3.2em")
        .borderRadius(themes.radii.normal)
        .backgroundColor(themes.colors.bg)}
      {...otherProps}>
      {onRequestClose && (
        <a
          href="#"
          onClick={withoutBubble(onRequestClose)}
          css={selector()
            .position("absolute")
            .top(0)
            .right(0)
            .minWidth(400)
            .padding("0.5em 1em")
            .opacity(0.5)
            .colorFill(themes.colors.text)}>
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
