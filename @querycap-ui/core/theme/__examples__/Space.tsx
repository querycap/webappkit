import { colors, selector, theme, themes } from "@querycap-ui/core";
import { map } from "lodash";
import React from "react";

export const Space = () => {
  return (
    <>
      <h2>间距</h2>

      <p>
        决定元素的 <code>margin</code>， <code>padding</code>
        通过预设值，可以让布局相对协调
      </p>

      <div css={selector().display("flex").flexDirection("column").alignItems("center")}>
        {map(theme.space, (v, k) => {
          return (
            <div key={k} css={selector().paddingX(v).marginTop(themes.space.s2).backgroundColor(colors.yellow1)}>
              <div
                css={selector()
                  .padding(themes.space.s2)
                  .width(200)
                  .border("1px solid")
                  .borderColor(themes.state.borderColor)
                  .backgroundColor(themes.state.backgroundColor)}>
                space.{k} = {v}px
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
