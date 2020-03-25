import { safeTextColor, selector, theme, themes } from "@querycap-ui/core";
import { map } from "lodash";
import React, { Fragment } from "react";
import { colors } from "../colors";

export const NOSRC = true;

export const Color_system = () => {
  const baseColors = ["black", "white", "gray", "darkBlue", "blue", "green", "yellow", "red", "purple"];
  const stateColors = ["primary", "success", "danger", "info", "warning"];

  return (
    <>
      <h2>基本色</h2>
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
      <h2>色阶</h2>
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

      <h2>状态色</h2>
      <div css={selector().display("flex").flexWrap("wrap").with(selector("& > *").flex(1).textAlign("center"))}>
        {map(stateColors, (stateColor, key) => (
          <div
            key={key}
            css={selector()
              .lineHeight(themes.lineHeights.normal)
              .fontFamily(themes.fonts.mono)
              .paddingY(themes.space.s2)
              .color(safeTextColor((theme.colors as any)[stateColor]))
              .backgroundColor((theme.colors as any)[stateColor])}>
            {stateColor}
          </div>
        ))}
      </div>

      <h2>反色</h2>
      <p>
        关于反色。是通过灰度计算公式得到 <a href="https://en.wikipedia.org/wiki/Grayscale">灰度值</a>
        ，并通过背景值计算出。
      </p>
    </>
  );
};
