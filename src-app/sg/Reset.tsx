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
              .overflow("hidden"),
          )
          .with(
            selector("#root")
              .with(() => cover())
              .lineHeight(themes.lineHeights.normal)
              .fontFamily(themes.fonts.normal)
              .color(themes.colors.text)
              .overflow("hidden"),
          )}
      />
    </>
  );
};
