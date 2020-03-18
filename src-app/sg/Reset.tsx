import { Global } from "@emotion/core";
import { cover, normalize } from "@querycap-ui/core";
import React from "react";

export const CSSReset = () => {
  return (
    <>
      <Global styles={normalize()} />

      <Global
        styles={{
          "*,*::after,*::before": {
            boxSizing: "border-box",
          },
        }}
      />

      <Global
        styles={(t) => ({
          "html, body": {
            position: "relative",
            height: "100%",
            width: "100%",
            overflow: "hidden",
          },
          "#root": {
            ...cover(),
            overflow: "hidden",
            fontFamily: t.fonts.normal,
          },
        })}
      />
    </>
  );
};
