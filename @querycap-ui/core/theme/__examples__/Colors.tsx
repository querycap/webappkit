import { safeTextColor, selector, theme, themes, ThemeState } from "@querycap-ui/core";
import { map } from "lodash";
import React, { Fragment } from "react";
import { colors } from "../colors";

export const NOSRC = true;

export const Color_system = () => {
  const baseColors = ["black", "white", "gray", "darkBlue", "blue", "green", "yellow", "red", "purple"];
  const stateColors = ["primary", "success", "danger", "info", "warning"];

  return (
    <>
      <h2>状态色</h2>
      <div css={selector().display("flex").flexWrap("wrap").with(selector("& > *").flex(1).textAlign("center"))}>
        {map(stateColors, (stateColor, key) => {
          return (
            <ThemeState
              key={key}
              backgroundColor={(theme.colors as any)[stateColor]}
              color={safeTextColor((theme.colors as any)[stateColor])}>
              <div
                css={selector()
                  .lineHeight(themes.lineHeights.normal)
                  .fontFamily(themes.fonts.mono)
                  .paddingY(themes.space.s2)
                  .color(themes.state.color)
                  .backgroundColor(themes.state.backgroundColor)}>
                {stateColor}
              </div>
            </ThemeState>
          );
        })}
      </div>

      <h2>基本色</h2>
      <div css={selector().display("flex").flexWrap("wrap").with(selector("& > *").flex(1).textAlign("center"))}>
        {map(baseColors, (baseColor, key) => {
          return (
            <ThemeState
              key={key}
              backgroundColor={(colors as any)[baseColor]}
              color={safeTextColor((colors as any)[baseColor])}>
              <div
                css={selector()
                  .lineHeight(themes.lineHeights.normal)
                  .fontFamily(themes.fonts.mono)
                  .paddingY(themes.space.s2)
                  .color(themes.state.color)
                  .backgroundColor(themes.state.backgroundColor)}>
                {baseColor}
              </div>
            </ThemeState>
          );
        })}
      </div>
      <h2>色阶</h2>
      <div
        css={selector()
          .display("flex")
          .flexWrap("wrap")
          .margin((t) => -t.space.s1)
          .with(selector("& > *").width("50%").textAlign("center"))}>
        {map(baseColors.slice(2), (colorName, key) => (
          <div css={selector().padding(themes.space.s1)} key={key}>
            {map(["", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"], (k) => {
              const colorValue = (colors as any)[`${colorName}${k}`];

              return (
                <Fragment key={`${colorName}${k}`}>
                  <ThemeState key={key} color={safeTextColor(colorValue)} backgroundColor={colorValue}>
                    <div
                      css={selector()
                        .display("flex")
                        .flexWrap("wrap")
                        .lineHeight(themes.lineHeights.normal)
                        .padding(themes.space.s2)
                        .fontFamily(themes.fonts.mono)
                        .justifyContent("space-between")
                        .color(themes.state.color)
                        .backgroundColor(themes.state.backgroundColor)}>
                      <span>{`${colorName}${k}`}</span>
                      <span>{colorValue}</span>
                    </div>
                  </ThemeState>
                </Fragment>
              );
            })}
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
