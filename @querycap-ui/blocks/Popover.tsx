import { selector, themes } from "@querycap-ui/core";
import { withAutoPlacement } from "@querycap/uikit";
import { startsWith } from "lodash";
import React from "react";
import { OverlayBaseProps, OverlayBase } from "./Overlay";

export const Popover = withAutoPlacement(({ children, placement, ...otherProps }: OverlayBaseProps) => {
  return (
    <OverlayBase {...otherProps} placement={placement}>
      <div
        style={{
          position: "relative",
          padding: startsWith(placement, "left") || startsWith(placement, "right") ? "0 4px" : "4px 0",
        }}>
        <div
          css={selector()
            .borderRadius(themes.radii.s)
            .border("1px solid")
            .borderColor(themes.colors.border)
            .backgroundColor(themes.colors.bg)
            .boxShadow(themes.shadows.normal)}>
          {children}
        </div>
      </div>
    </OverlayBase>
  );
});
