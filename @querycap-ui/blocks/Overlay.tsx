import { animated, useTransition } from "@querycap-ui/core/macro";
import { IOverlayProps, Overlay as OverlayBase } from "@querycap/uikit";
import React, { ReactNode } from "react";

export interface OverlayProps extends IOverlayProps {
  isOpen: boolean;
  children?: ReactNode;
}

const transformOf = (placement = "bottom", v: number) => {
  const p = placement.split("-")[0];

  const isX = p === "left" || p === "right";
  const isPositive = p === "bottom" || p === "right";

  const pos = {
    [isX ? "x" : "y"]: isPositive ? v : -v,
  };

  return `translate3d(${pos["x"] || 0}px,${pos["y"] || 0}px,0)`;
};

const AnimatedOverlay = animated(OverlayBase);

export const Overlay = ({ fullWidth, isOpen, triggerRef, onRequestClose, placement, children }: OverlayProps) => {
  const transition = useTransition(isOpen, null, {
    from: { opacity: 0, transform: transformOf(placement as string, 5) },
    enter: { opacity: 1, transform: transformOf(placement as string, 1) },
    leave: { opacity: 0, transform: transformOf(placement as string, 3) },
    config: { mass: 1, tension: 500, friction: 40 },
  });

  return (
    <>
      {transition.map(
        ({ item, key, props: style }) =>
          item && (
            <AnimatedOverlay
              key={key}
              triggerRef={triggerRef}
              placement={placement}
              style={style}
              fullWidth={fullWidth}
              onRequestClose={onRequestClose}>
              {children}
            </AnimatedOverlay>
          ),
      )}
    </>
  );
};
