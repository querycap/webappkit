import { selector, themes } from "@querycap-ui/core";
import { map } from "lodash";
import React from "react";
import * as IconSets from "..";

export const NOSRC = true;

export const Icons = () => (
  <div
    css={selector()
      .display("flex")
      .flexWrap("wrap")}>
    {map(IconSets, (Icon, key) => (
      <div
        key={key}
        css={selector()
          .display("flex")
          .alignItems("center")
          .width("25%")}>
        <span
          css={selector()
            .fontSize(themes.fontSizes.l)
            .padding(themes.space.s1)}>
          <Icon />
        </span>
        <span
          css={selector()
            .fontSize(themes.fontSizes.s)
            .fontFamily(themes.fonts.mono)
            .padding(themes.space.s1)}>
          {key}
        </span>
      </div>
    ))}
  </div>
);
