import { select, shadows, theme, tintOrShade, withBackground } from "@querycap-ui/core/macro";
import { useToggle, useToggleControlOnHover, withAutoPlacement } from "@querycap/uikit";
import { flow } from "lodash";
import React, { Children, cloneElement, isValidElement, ReactChild, ReactNode, useRef } from "react";
import { Overlay, OverlayProps } from "./Overlay";

export const Tooltip = withBackground(flow(theme.state.color, tintOrShade(0.05)))(
  withAutoPlacement(({ placement, children, ...otherProps }: OverlayProps) => {
    return (
      <Overlay {...otherProps} placement={placement}>
        <div
          css={select()
            .fontSize(theme.fontSizes.xs)
            .lineHeight(theme.lineHeights.condensed)
            .position("relative")
            .display("block")
            .padding(theme.space.s1)
            .zIndex(500)
            .pointerEvents("none")
            .with(select("&:before").content(`""`).position("absolute").left("50%").marginLeft(-1).zIndex(2))}>
          <div
            css={select()
              .colorFill(theme.state.color)
              .backgroundColor(theme.state.backgroundColor)
              .boxShadow(shadows.normal)
              .borderRadius(theme.radii.s)
              .padding("0.25em 0.5em")}>
            {children}
          </div>
        </div>
      </Overlay>
    );
  }),
);

export interface TooltipTriggerProps {
  placement?: OverlayProps["placement"];
  content: ReactNode;
  children: ReactChild;
}

export const TooltipTrigger = ({ placement, content, children }: TooltipTriggerProps) => {
  const ref = useRef(null);
  const [isOpen, show, hide] = useToggle();

  useToggleControlOnHover(ref, () => (isOpen ? hide() : show()));

  const trigger = Children.only(children);

  return (
    <>
      <Tooltip isOpen={isOpen} triggerRef={ref} onRequestClose={hide} placement={placement}>
        {content}
      </Tooltip>
      {isValidElement(trigger) && cloneElement(trigger, { ref: ref })}
    </>
  );
};
