import React, { FunctionComponent, ReactNode, RefObject, useMemo, useRef } from "react";
import { withPortal } from "./Portal";
import { usePortalCloseOnEsc, usePortalCloseOnOutsideClick } from "./portal-controls";
import { calcPosition, useRectOfElement } from "./position";

export interface IOverlayProps {
  triggerRef: RefObject<Element>;
  placement?:
    | "top"
    | "bottom"
    | "left"
    | "*left"
    | "left*"
    | "right"
    | "*right"
    | "right*"
    | "left-top"
    | "left-bottom"
    | "right-top"
    | "right-bottom"
    | "top-left"
    | "bottom-left"
    | "top-right"
    | "bottom-right";
  onRequestClose?: () => void;
  fullWidth?: boolean;
  children?: ReactNode;
  updateBy?: any[];
}

export const withAutoPlacement = <TProps extends IOverlayProps = IOverlayProps>(Comp: FunctionComponent<TProps>) => {
  return (props: TProps) => {
    const [triggerRect] = useRectOfElement(props.triggerRef, true, []);

    const placement = useMemo(
      () =>
        (props.placement || triggerRect.placement)
          .replace(/\*$/, `-${triggerRect.placement === "top" ? "bottom" : "top"}`)
          .replace(/^\*/, `${triggerRect.placement}-`),
      [props.placement, triggerRect.placement],
    );

    return <Comp {...props} placement={placement} triggerRect={triggerRect} />;
  };
};

export const Overlay = withPortal(
  ({
    updateBy,
    style,
    children,
    fullWidth,
    onRequestClose,
    triggerRef,
    placement,
  }: IOverlayProps & React.HTMLAttributes<any>) => {
    const contentRef = useRef<Element | null>(null);

    const [triggerRect] = useRectOfElement(triggerRef, true, []);
    const [contentRect] = useRectOfElement(contentRef, true, updateBy);

    const [left, top] = calcPosition(placement || triggerRect.placement, triggerRect, contentRect);

    usePortalCloseOnOutsideClick(onRequestClose, [triggerRef, contentRef]);
    usePortalCloseOnEsc(onRequestClose);

    const domReady = contentRect && (!!contentRect.width || !!contentRect.height);

    return (
      <div
        ref={contentRef as any}
        data-placement={placement}
        style={{
          ...style,
          left: left,
          top: top,
          pointerEvents: domReady ? "auto" : "none",
          position: "absolute",
          zIndex: 10,
          minWidth: fullWidth ? triggerRect.width : "auto",
        }}>
        {children}
      </div>
    );
  },
);
