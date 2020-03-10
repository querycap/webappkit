import { cover, Global, normalize } from "@querycap-ui/styling";
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
        styles={(ds) => ({
          "html, body": {
            position: "relative",
            height: "100%",
            width: "100%",
            overflow: "hidden",
          },

          body: {
            fontFamily: ds.fontFamily.system,
            fontSize: ds.size.xxs,
            color: `${ds.color.text}`,
          },

          a: {
            color: `${ds.color.primary}`,
            textDecoration: "none",
          },

          hr: {
            border: 0,
            borderBottom: `1px solid ${ds.color.border}`,
            borderTop: `1px solid ${ds.color.border}`,
            color: `${ds.color.border}`,
            margin: "1em 0",
          },

          "#root": {
            ...cover(),
            overflow: "hidden",
          },

          "h1, h2, h3, h4, h5, h6": {
            margin: 0,
          },

          ul: {
            margin: 0,
            padding: 0,
            listStyle: "none",
          },

          "button, input, optgroup, select, textarea": {
            fontFamily: "inherit",
            color: "inherit",
            fontSize: "100%",
            lineHeight: 1.15,
            margin: 0,
          },

          "button, input": {
            overflow: "visible",
          },

          "button, select": {
            textTransform: "none",
          },
        })}
      />
    </>
  );
};
