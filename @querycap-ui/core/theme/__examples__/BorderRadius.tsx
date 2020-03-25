import { selector, theme, themes } from "@querycap-ui/core";
import { map } from "lodash";
import React from "react";

export const BorderRadius = () => {
  return (
    <>
      <h2>圆角</h2>

      <div css={selector().display("flex").flexDirection("column").alignItems("center").fontFamily(themes.fonts.mono)}>
        {map(theme.radii, (v, k) => {
          return (
            <div css={selector().paddingX(v).marginTop(themes.space.s4)}>
              <div
                css={selector()
                  .padding(themes.space.s2)
                  .width(400)
                  .border("1px solid")
                  .borderRadius(v)
                  .borderColor(themes.state.borderColor)
                  .backgroundColor(themes.state.backgroundColor)}>
                radii.{k} = {v}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
