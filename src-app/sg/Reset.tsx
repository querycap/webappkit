import { Global } from "@emotion/core";
import { cover, normalize, selector, themes } from "@querycap-ui/core";
import { headings } from "@querycap-ui/texts";
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
          )
          .with(selector("h1").with(headings.h1))
          .with(selector("h2").with(headings.h2))
          .with(selector("h3").with(headings.h3))
          .with(selector("h4").with(headings.h4))
          .with(selector("h5").with(headings.h5))
          .with(selector("h6").with(headings.h6))}
      />
    </>
  );
};
