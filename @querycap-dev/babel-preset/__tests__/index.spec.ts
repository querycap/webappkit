import { transform } from "@babel/core";
import babelPreset from "@querycap-dev/babel-preset";

test("babel", () => {
  const ret = transform(
    `
const a = {
  a: 1
}

const b = {
  ...a,
  b: 1
}    
    `,
    {
      presets: [babelPreset],
    },
  );

  console.log(ret?.code);
});
