import { selector, shadows, themes } from "@querycap-ui/core";
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
          css={selector()
            .borderRadius(themes.radii.s)
            .border("1px solid")
            .borderColor(themes.state.borderColor)
            .color(themes.state.color)
            .backgroundColor(themes.state.backgroundColor)
            .boxShadow(shadows.normal)}>
          {children}
        </div>
      </div>
    </Overlay>
  );
});
