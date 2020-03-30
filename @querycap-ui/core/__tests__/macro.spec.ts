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
    const result = compileToSnapshot(`
import React from "react"
import { select, theme } from "@querycap-ui/core/macro"

const C = () => {
  return (
    <>
      <div css={select().padding(theme.space.s2).display("flex")}></div>
    </>
  )
}`);

    expect(result).toMatchSnapshot();
  });

  it("select", () => {
    const result = compileToSnapshot(`
import React from "react"
import { select, OptionFocusedAttr } from "@querycap-ui/core/macro"

const v = ""

const C = () => {

  return (
    <>
      <div css={select()
      .with(select("& > h1", "& > h2").color("red").with(
        select(\`&[\${OptionFocusedAttr}=true]\`).color("red")
      ))
      .with(select(v).color("red"))
      .with(select().color("red"))}></div>
    </>
  )
}
`);

    console.log(result);

    expect(result).toMatchSnapshot();
  });

  it("nests", () => {
    const result = compileToSnapshot(`
import React from "react"
import { flow } from "lodash"
import { select, theme, animated, cover } from "@querycap-ui/core/macro"

const C = () => {
  const v = "red"

  return (
    <>
      <div css={select()
      .border(flow(theme.state.borderColor, (color) => \`2px solid \${color}\`))
      .padding(theme.space.s2)
      .display("flex")
      .color(v)
      .with(select("& > h2").color("red"))
      .with(cover)
      .with({
        fontSize: 1,
      })
      .with(v && select().color(theme.state.color))
      .with(v || select().color(theme.state.color))
      .with(v ? undefined: select("& > a").color(theme.state.color))}></div>
    </>
  )
}

const Animated = animated(C);
`);

    expect(result).toMatchSnapshot();
  });

  it("flow", () => {
    const result = compileToSnapshot(`
import React from "react"
import { flow } from "lodash"
import { select, theme } from "@querycap-ui/core/macro"

const C = () => {
  const v = "red"

  return (
    <>
      <div css={select().border(flow(theme.state.borderColor, (color) => \`2px solid \${color}\`))}>
      </div>
      
      <div css={select().border(flow(theme.state.borderColor, (color) => \`2px solid \${color + v}\`))}>
      </div>
    </>
  )
}
`);

    expect(result).toMatchSnapshot();
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
import { flow } from "lodash";
import { base } from "./util";

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

    expect(results).toMatchSnapshot();
  });

  it("builder only", () => {
    const results = compileToSnapshot(`
import { select, theme } from "@querycap-ui/core/macro";
    
export const headings = {
  h1: select()
    .marginTop(theme.space.s4)
    .marginBottom(1)
    .fontSize(12)
    .fontWeight(theme.fontWeights.bold),
};
`);

    expect(results).toMatchSnapshot();
  });
});
