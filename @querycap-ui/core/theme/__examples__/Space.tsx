import { colors, select, defaultTheme, theme } from "@querycap-ui/core/macro";
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

      <div css={select().display("flex").flexDirection("column").alignItems("center")}>
        {map(defaultTheme.space, (v, k) => {
          return (
            <div key={k} css={select().paddingX(v).marginTop(theme.space.s2).backgroundColor(colors.yellow1)}>
              <div
                css={select()
                  .padding(theme.space.s2)
                  .width(200)
                  .border("1px solid")
                  .borderColor(theme.state.borderColor)
                  .backgroundColor(theme.state.backgroundColor)}>
                space.{k} = {v}px
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
