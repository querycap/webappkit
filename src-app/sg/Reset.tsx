import { Global } from "@emotion/core";
import { cover, normalize, select, theme } from "@querycap-ui/core";
import { headings } from "@querycap-ui/texts";
import React from "react";

export const CSSReset = () => {
  return (
    <>
      <Global styles={normalize()} />

      <Global styles={select("*,*::after,*::before").boxSizing("border-box")} />

      <Global
        styles={select()
          .with(
            select("html, body")
              .position("relative")
              .height("100%")
              .width("100%")
              .overflow("hidden")
              .lineHeight(theme.lineHeights.normal)
              .color(theme.state.color)
              .fontFamily(theme.fonts.normal),
          )
          .with(
            select("#root")
              .with(() => cover())
              .overflow("hidden"),
          )
          .with(select("a").color(theme.colors.primary))
          .with(select("h1").with(headings.h1))
          .with(select("h2").with(headings.h2))
          .with(select("h3").with(headings.h3))
          .with(select("h4").with(headings.h4))
          .with(select("h5").with(headings.h5))
          .with(select("h6").with(headings.h6))}
      />
    </>
  );
};
