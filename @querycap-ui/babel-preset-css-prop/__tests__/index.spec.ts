import { transform } from "@babel/core";

const compile = (code: string) => {
  const t = transform(code, {
    presets: ["@babel/preset-env", "@querycap-dev/babel-preset", "@querycap-ui/babel-preset-css-prop"],
  });

  return t?.code;
};

describe("babel", () => {
  it("without css", () => {
    console.log(
      compile(`
import React from "react"

const SomeComponent = () => {
  return (
    <>
      <div>${Date.now()}</div>
    </>
  )
}`),
    );
  });

  it("with css", () => {
    console.log(
      compile(`
import React from "react"

const SomeComponent = () => {
  return (
    <>
      <div css={(t) => ({ color: t.color.primary })}>${Date.now()}</div>
    </>
  )
}`),
    );
  });
});
