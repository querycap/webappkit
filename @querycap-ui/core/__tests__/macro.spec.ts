import { transformSync } from "@babel/core";

const compileToSnapshot = (code: string) => {
  const t = transformSync(code, {
    root: __dirname,
    plugins: ["@babel/plugin-syntax-jsx", "babel-plugin-macros", "babel-plugin-emotion"],
  });

  return `
${code}
    
 ↓ ↓ ↓ ↓ ↓ ↓

${t?.code}  
  `;
};

describe("@querycap-ui/core/macro", () => {
  it("simple", () => {
    const result = compileToSnapshot(`
import React from "react"
import { select, animated } from "@querycap-ui/core/macro"
import { css } from "@emotion/core";

const v = css({ color: "red" })

const C = () => {
  return (
    <>
      <animated.div css={select().flex(1)}></animated.div>
    </>
  )
}`);

    expect(result).toMatchSnapshot();
  });

  it("with variables", () => {
    expect(
      compileToSnapshot(`
import React from "react"
import { select, theme } from "@querycap-ui/core/macro"

const C = () => {
  return (
    <>
      <div css={select().padding(theme.space.s2).display("flex")}></div>
    </>
  )
}`),
    ).toMatchSnapshot();
  });

  it("nests", () => {
    expect(
      compileToSnapshot(`
import React from "react"
import { select, theme, animated } from "@querycap-ui/core/macro"

const C = () => {
  return (
    <>
      <div css={select().padding(theme.space.s2).display("flex").with(select("& > h2").color("red"))}></div>
    </>
  )
}

const Animated = animated(C);
`),
    ).toMatchSnapshot();
  });

  it("complex", () => {
    const results = compileToSnapshot(`
import {
  colors,
  rgba,
  roundedEm,
  safeTextColor,
  select,
  simpleShadow,
  theme,
  tint,
  tintOrShade,
  transparentize,
} from "@querycap-ui/core/macro";

const createBtnStyle = ({block, invisible, small}) =>
  select()
    .with(base)
    .position("relative")
    .paddingX(block ? 0 : small ? "1.2em" : "1.6em")
    .paddingY(flow(theme.state.fontSize, roundedEm(small ? 0.25 : 0.5)))
    .display(block ? "block" : "inline-block")
    .alignItems("center")
    .outline("none")
    .backgroundColor(theme.state.backgroundColor)
    .borderColor(theme.state.borderColor)
    .colorFill(theme.state.color)
    .with(block && select().width("100%").justifyContent("center"))
    .with(invisible && select().borderColor("transparent"))
    .with(select("&:hover").opacity(0.9).cursor("pointer"))
    .with(select("& > * + *").marginLeft(theme.space.s1))
    .with(invisible ? undefined : select("&:active").boxShadow(\`inset 0 0.15em 0.3em \${rgba(colors.black, 0.15)}\`))
    .with(
      invisible
        ? undefined
        : select("&:focus")
          .outline(0)
          .zIndex(1)
          .boxShadow(flow(theme.state.borderColor, transparentize(0.85), simpleShadow("0 0 0 0.2em"))),
    )
    .with(select("&:disabled").opacity(0.6).cursor("default"));
`);

    console.log(results);

    expect(results).toMatchSnapshot();
  });
});
