import { selector, shadows, themes } from "@querycap-ui/core";
import { map } from "lodash";
import React from "react";

export const Shadows = () => {
  return (
    <>
      <h2>阴影</h2>

      <div css={selector().display("flex").flexDirection("column").alignItems("center").fontFamily(themes.fonts.mono)}>
        {map(shadows, (v, k) => {
          return (
            <div css={selector().paddingX(v).marginTop(themes.space.s4)}>
              <div
                css={selector()
                  .padding(themes.space.s2)
                  .width(400)
                  .borderRadius(themes.radii.normal)
                  .backgroundColor(themes.state.backgroundColor)
                  .boxShadow(v)}>
                {k}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
