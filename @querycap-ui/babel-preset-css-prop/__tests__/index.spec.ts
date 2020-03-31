import { transformSync } from "@babel/core";
import presetCSSProp from "@querycap-ui/babel-preset-css-prop";

const compileToSnapshot = (code: string) => {
  const t = transformSync(code, {
    root: __dirname,
    presets: [presetCSSProp],
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
const SomeComponent = () => {
  return (
    <>
      <div>123</div>
    </>
  )
}`),
    ).toMatchSnapshot();
  });

  it("css prop", () => {
    expect(
      compileToSnapshot(`
const SomeComponent = () => {
  return (
    <>
      <div css={(t) => ({ color: t.color.primary })}>123</div>
    </>
  )
}`),
    ).toMatchSnapshot();
  });

  it("css prop only", () => {
    expect(
      compileToSnapshot(`
const SomeComponent = () => {
  return (
    <div css={(t) => ({ color: t.color.primary })}>123</div>
  )
}`),
    ).toMatchSnapshot();
  });
});
