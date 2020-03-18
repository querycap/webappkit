import { applyStyles, safeTextColor, selector, themes } from "@querycap-ui/core";
import { map } from "lodash";
import React, { Fragment } from "react";
import { colors } from "../colors";

export const Colors = () => {
  const baseColors = ["black", "gray", "darkBlue", "blue", "green", "yellow", "red", "purple"];

  return (
    <>
      <div
        css={applyStyles(
          selector()
            .display("flex")
            .flexWrap("wrap"),
          selector("& > *")
            .flex(1)
            .textAlign("center"),
        )}>
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
      <hr />
      <div
        css={applyStyles(
          selector()
            .display("flex")
            .flexWrap("wrap")
            .margin((t) => -t.space.s1),
          selector("& > *")
            .width("50%")
            .textAlign("center"),
        )}>
        {map(baseColors.slice(1), (color, key) => (
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
    </>
  );
};
