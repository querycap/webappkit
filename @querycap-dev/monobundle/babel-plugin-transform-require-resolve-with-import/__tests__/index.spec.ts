import { transformSync } from "@babel/core";
import plugin from "..";

const compileToSnapshot = (code: string) => {
  const t = transformSync(code, {
    root: __dirname,
    plugins: [plugin],
  });

  return `
${code}
    
 ↓ ↓ ↓ ↓ ↓ ↓

${t?.code}  
  `;
};

describe("babel-plugin-transform-require-resolve-with-import", () => {
  it("require.resolve", () => {
    const result = compileToSnapshot(`
const v = require.resolve("rollup-plugin-dts")
`);

    console.log(result);

    expect(result).toMatchSnapshot();
  });
});
