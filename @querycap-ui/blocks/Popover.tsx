import { select, shadows, theme } from "@querycap-ui/core/macro";
import { withAutoPlacement } from "@querycap/uikit";
import { startsWith } from "lodash";
import React from "react";
import { Overlay, OverlayProps } from "./Overlay";

export const Popover = withAutoPlacement(({ children, placement, ...otherProps }: OverlayProps) => {
  return (
    <Overlay {...otherProps} placement={placement}>
      <div
        style={{
          position: "relative",
          padding: startsWith(placement, "left") || startsWith(placement, "right") ? "0 4px" : "4px 0",
        }}>
        <div
          css={select()
            .borderRadius(theme.radii.s)
            .border("1px solid")
            .borderColor(theme.state.borderColor)
            .color(theme.state.color)
            .backgroundColor(theme.state.backgroundColor)
            .boxShadow(shadows.normal)}>
          {children}
        </div>
      </div>
    </Overlay>
  );
});
