import { IconSquare } from "@querycap-ui/icons";
import React from "react";

const scales = [1, 1.2, 1.8, 2];

export const IconBaseLines = () => (
  <div css={{ lineHeight: 2 }}>
    {scales.map((scale) => {
      return (
        <div key={scale} css={{ fontSize: `${scale}em` }}>
          <IconSquare /> 文字
        </div>
      );
    })}
    {scales.map((scale) => {
      return (
        <div key={scale} css={{ "& > * + *": { marginLeft: "0.5em" } }}>
          <span>
            <IconSquare scale={scale} />
          </span>
          <span>文字</span>
        </div>
      );
    })}
  </div>
);
