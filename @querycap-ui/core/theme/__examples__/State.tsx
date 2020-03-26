import { colors, select, defaultTheme, theme, ThemeState } from "@querycap-ui/core/macro";
import { Button } from "@querycap-ui/form-controls";
import { Stack } from "@querycap-ui/layouts";
import { map } from "lodash";
import React from "react";

export const NOSRC = true;

const Panel = () => {
  return (
    <div css={select().padding(theme.space.s2).backgroundColor(theme.state.backgroundColor).color(theme.state.color)}>
      <div
        css={select()
          .padding(theme.space.s4)
          .border("1px solid")
          .borderColor(theme.state.borderColor)
          .borderRadius(theme.radii.normal)}>
        <h1 style={{ margin: 0 }}>标题</h1>
        <p>文本文本</p>
        <div>
          <Button small>确定</Button>
        </div>
      </div>
    </div>
  );
};

export const State = () => {
  return (
    <>
      <h2>状态值</h2>
      <p>用作需要动态计算的场景。如 Dark Mode</p>
      <p>所有的 theme 值都提供外部注入以支持简单样式主题变化，但不支持样式的覆写（维护成本过大）</p>
      <h3>
        多级 <code>rem</code> —— <code>theme.state.fontSize</code>
      </h3>
      <p>
        有时候，我们会使用 <code>em</code> 作为边距等值，
        但这样使用可能会计算出带小数像素值，在不同的浏览器，渲染小数点数值的逻辑不一致，会使得元素在视觉上会有错位。
        因而，用 <code>theme.state.fontSize</code> 来定义基础的文字大小，通过取值并在 JavaScript
        计算并取整来解决上面的问题，如 Button
      </p>
      <Stack spacing={theme.space.s2}>
        {map([12, 14, 18, 20, 24, 48], (v) => (
          <ThemeState fontSize={v} key={v}>
            <Button block small>
              Button {v} px
            </Button>
          </ThemeState>
        ))}
      </Stack>
      <p>同样的，在需要动态计算的场景，这个值也会非常有用。</p>
      <h3>Color Theme Switch</h3>
      <ul style={{ backgroundColor: colors.yellow0, padding: "0.2em" }}>
        <li>
          前景色&nbsp;<code style={{ color: defaultTheme.state.color }}>theme.state.color</code>
        </li>
        <li>
          边框色&nbsp;
          <code style={{ color: defaultTheme.state.borderColor }}>theme.state.borderColor</code>
        </li>
        <li>
          背景色&nbsp;
          <code
            style={{
              color: defaultTheme.state.backgroundColor,
            }}>
            theme.state.backgroundColor
          </code>
        </li>
      </ul>
      <p>
        其他非状态颜色应该从这几个颜色计算而来，如 <code>box-shadow</code> 等，通过修改这三个颜色，来快速实现 dark mode
      </p>
      <Stack inline spacing={theme.space.s4} css={select("& > *").flex(1)}>
        <Panel />

        <ThemeState borderColor={colors.gray6} color={colors.gray2} backgroundColor={colors.darkBlue9}>
          <Panel />
        </ThemeState>
      </Stack>
    </>
  );
};
