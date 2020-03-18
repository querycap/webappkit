import { selector } from "@querycap-ui/core";
import { map } from "lodash";
import React from "react";
import * as IconSets from "..";

export const Icons = () => (
  <div
    css={selector()
      .display("flex")
      .flexWrap("wrap")}>
    {map(IconSets, (Icon, key) => (
      <div
        key={key}
        css={{
          display: "flex",
          alignItems: "center",
          width: "20%",
        }}>
        <span
          css={selector()
            .fontSize((t) => t.fontSizes.l)
            .padding((t) => t.space.s1)}>
          <Icon />
        </span>
        <span
          css={selector()
            .fontSize((t) => t.fontSizes.s)
            .fontFamily((t) => t.fonts.mono)
            .padding((t) => t.space.s1)}>
          {key}
        </span>
      </div>
    ))}
  </div>
);
