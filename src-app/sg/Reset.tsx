import { Global } from "@emotion/core";
import { cover, normalize, selector, themes } from "@querycap-ui/core";
import React from "react";

export const CSSReset = () => {
  return (
    <>
      <Global styles={normalize()} />

      <Global styles={selector("*,*::after,*::before").boxSizing("border-box")} />

      <Global
        styles={selector()
          .with(
            selector("html, body")
              .position("relative")
              .height("100%")
              .width("100%")
              .overflow("hidden")
              .lineHeight(themes.lineHeights.normal)
              .color(themes.state.color)
              .fontFamily(themes.fonts.normal),
          )
          .with(
            selector("#root")
              .with(() => cover())
              .overflow("hidden"),
          )}
      />
    </>
  );
};
