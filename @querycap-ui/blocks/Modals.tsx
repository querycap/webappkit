import {
  animated,
  cover,
  preventDefault,
  rgba,
  select,
  stopPropagation,
  theme,
  useTransition,
} from "@querycap-ui/core/macro";
import { IconX } from "@querycap-ui/icons";
import { useOnExactlyClick, usePortalCloseOnEsc, withPortal } from "@querycap/uikit";
import { noop } from "lodash";
import  { forwardRef, Fragment, HTMLAttributes, ReactNode, Ref, useRef } from "react";
import { pipe } from "rxjs";

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

export const useModalTransition = (isOpen = false, onDestroyed?: () => void) =>
  useTransition(isOpen, null, {
    from: { opacity: 0.5, transform: "translate3d(0,30px,0) scale(1)" },
    enter: { opacity: 1, transform: "translate3d(0,0,0) scale(1)" },
    leave: { opacity: 0, transform: "translate3d(0,0,0) scale(0.9)" },
    config: { mass: 1, tension: 500, friction: 40 },
    onDestroyed: (isDestroyed) => isDestroyed && onDestroyed && onDestroyed(),
  });

export const ModalPanel = forwardRef(
  (
    { children, onRequestClose, ...otherProps }: ModalBaseProps & HTMLAttributes<HTMLDivElement>,
    ref: Ref<HTMLDivElement>,
  ) => (
    <div
      ref={ref}
      css={select()
        .position("relative")
        .minWidth(300)
        .padding("2.8em 3.2em")
        .borderRadius(theme.radii.normal)
        .backgroundColor(theme.state.backgroundColor)}
      {...otherProps}>
      {onRequestClose && (
        <a
          href="#"
          onClick={pipe(preventDefault, stopPropagation, onRequestClose)}
          css={select()
            .position("absolute")
            .top(0)
            .right(0)
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

export const ModalBackdrop = ({ onRequestClose, ...others }: HTMLAttributes<any> & ModalBaseProps) => {
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

export interface ModalPropsWithOnDestroyed extends ModalProps {
  onDestroyed?: () => void;
}

export const Modal = ({ isOpen, children, onRequestClose, onDestroyed }: ModalPropsWithOnDestroyed) => {
  const transition = useModalTransition(isOpen, onDestroyed);

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

export const ModalDialog = ({ isOpen, children, onRequestClose, onDestroyed }: ModalPropsWithOnDestroyed) => {
  const transition = useModalTransition(isOpen, onDestroyed);

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
