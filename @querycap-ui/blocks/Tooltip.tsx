import { selector, themes, withBackground } from "@querycap-ui/core";
import { useToggle, useToggleControlOnHover, withAutoPlacement } from "@querycap/uikit";
import React, { Children, cloneElement, isValidElement, ReactChild, ReactNode, useRef } from "react";
import { OverlayBase, OverlayBaseProps } from "./Overlay";

const WithBackground = withBackground(themes.colors.gray9);

export const Tooltip = withAutoPlacement(({ placement, children, ...otherProps }: OverlayBaseProps) => {
  return (
    <WithBackground>
      <OverlayBase {...otherProps} placement={placement}>
        <div
          css={selector()
            .fontSize(themes.fontSizes.xs)
            .lineHeight(themes.lineHeights.condensed)
            .with({
              position: "relative",
              display: "block",
              padding: 4,
              zIndex: 500,
              pointerEvents: "none",
            })
            .with(
              selector("&:before").with({
                content: `""`,
                position: "absolute",
                left: "50%",
                marginLeft: -3,
                zIndex: 2,
              }),
            )}>
          <div
            css={selector()
              .colorFill(themes.colors.text)
              .backgroundColor(themes.colors.bg)
              .boxShadow(themes.shadows.normal)
              .borderRadius(themes.radii.s)
              .padding("0.25em 0.5em")}>
            {children}
          </div>
        </div>
      </OverlayBase>
    </WithBackground>
  );
});

export interface TooltipTriggerProps {
  placement?: OverlayBaseProps["placement"];
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
