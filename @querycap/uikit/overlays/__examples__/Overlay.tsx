import { Overlay } from "@querycap/uikit";
import React, { useRef } from "react";

const Placement = ({ placement }: { placement: string }) => {
  const ref = useRef(null);

  return (
    <>
      <div
        ref={ref}
        css={{
          border: `1px solid #ddd`,
          padding: "1em",
        }}>
        {placement}
      </div>
      <Overlay triggerRef={ref} placement={placement as any}>
        <div
          css={{
            border: `1px solid #ddd`,
            backgroundColor: `#eee`,
            padding: "2em",
          }}>
          {placement}
        </div>
      </Overlay>
    </>
  );
};

export const Overlays = () => (
  <div
    css={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      "& > *": { width: "30%", padding: "6em" },
    }}>
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
      <div key={placement}>
        <Placement placement={placement} />
      </div>
    ))}
  </div>
);
