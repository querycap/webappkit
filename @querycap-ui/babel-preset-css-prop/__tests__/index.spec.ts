import { transformSync } from "@babel/core";

const compileToSnapshot = (code: string) => {
  const t = transformSync(code, {
    root: __dirname,
    presets: ["@querycap-ui/babel-preset-css-prop"],
  });

  return `
${code}
    
 ↓ ↓ ↓ ↓ ↓ ↓

${t?.code}  
  `;
};

describe("babel-preset-css-prop", () => {
  it("without css prop", () => {
    expect(
      compileToSnapshot(`
import React from "react"

const SomeComponent = () => {
  return (
    <>
      <div>123</div>
    </>
  )
}`),
    ).toMatchSnapshot();
  });

  it("with css prop", () => {
    expect(
      compileToSnapshot(`
import React from "react"

const SomeComponent = () => {
  return (
    <>
      <div css={(t) => ({ color: t.color.primary })}>123</div>
    </>
  )
}`),
    ).toMatchSnapshot();
  });
});
