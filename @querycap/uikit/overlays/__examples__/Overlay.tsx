import { Overlay } from "@querycap/uikit";
import React, { useRef } from "react";

export const Overlays = () => {
  const ref = useRef(null);

  return (
    <div
      css={{
        padding: "20em",
        fontSize: 10,
      }}>
      <div
        ref={ref}
        css={{
          border: `1px solid #ddd`,
          width: "30em",
          height: "30em",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        Trigger
      </div>
      {[
        "left",
        "right",
        "bottom",
        "top",
        "left-top",
        "left-bottom",
        "right-top",
        "right-bottom",
        "top-left",
        "bottom-left",
        "top-right",
        "bottom-right",
      ].map((placement) => (
        <Overlay key={placement} triggerRef={ref} placement={placement as any}>
          <div
            css={{
              fontSize: 10,
              border: `1px solid #ddd`,
              backgroundColor: `#eee`,
              width: "8em",
              height: "8em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
            {placement}
          </div>
        </Overlay>
      ))}
    </div>
  );
};
