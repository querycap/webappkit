import { safeTextColor, selector, themes } from "@querycap-ui/core";
import { headings, Markdown } from "@querycap-ui/texts";
import { map } from "lodash";
import React, { Fragment } from "react";
import { colors } from "../colors";

const docs = `
## Tips

关于反色。是通过灰度计算公式 <https://en.wikipedia.org/wiki/Grayscale> 得到灰度值，
当背景色的灰度值为小于 255 - 60，则使用浅色文字，否则为深色文字。
`;

export const NOSRC = true;

export const Color_system = () => {
  const baseColors = ["black", "white", "gray", "darkBlue", "blue", "green", "yellow", "red", "purple"];

  return (
    <>
      <h2 css={headings.h2}>基本色</h2>
      <div css={selector().display("flex").flexWrap("wrap").with(selector("& > *").flex(1).textAlign("center"))}>
        {map(baseColors, (color, key) => (
          <div
            key={key}
            css={selector()
              .lineHeight(themes.lineHeights.normal)
              .fontFamily(themes.fonts.mono)
              .paddingY(themes.space.s2)
              .color(safeTextColor((colors as any)[color]))
              .backgroundColor((colors as any)[color])}>
            {color}
          </div>
        ))}
      </div>
      <h2 css={headings.h2}>色阶</h2>
      <div
        css={selector()
          .display("flex")
          .flexWrap("wrap")
          .margin((t) => -t.space.s1)
          .with(selector("& > *").width("50%").textAlign("center"))}>
        {map(baseColors.slice(2), (color, key) => (
          <div css={selector().padding(themes.space.s1)} key={key}>
            {map(["", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], (k) => {
              const colorValue = (colors as any)[`${color}${k}`];

              return (
                <Fragment key={`${color}${k}`}>
                  <div
                    css={selector()
                      .display("flex")
                      .flexWrap("wrap")
                      .lineHeight(themes.lineHeights.normal)
                      .padding(themes.space.s2)
                      .fontFamily(themes.fonts.mono)
                      .justifyContent("space-between")
                      .backgroundColor(colorValue)
                      .color(safeTextColor(colorValue))}>
                    <span>{`${color}${k}`}</span>
                    <span>{colorValue}</span>
                  </div>
                </Fragment>
              );
            })}
          </div>
        ))}
      </div>
      <Markdown>{docs}</Markdown>
    </>
  );
};
