import { select, shadows, theme } from "@querycap-ui/core/macro";
import { map } from "lodash";
import React from "react";

export const Shadows = () => {
  return (
    <>
      <h2>阴影</h2>

      <div css={select().display("flex").flexDirection("column").alignItems("center").fontFamily(theme.fonts.mono)}>
        {map(shadows, (v, k) => {
          return (
            <div key={k} css={select().paddingX(v).marginTop(theme.space.s4)}>
              <div
                css={select()
                  .padding(theme.space.s2)
                  .width(400)
                  .borderRadius(theme.radii.normal)
                  .backgroundColor(theme.state.backgroundColor)
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
