import path from "path";
import { generate } from "..";

describe("#generate", () => {
  it("generate ts", () => {
    generate(path.join(__dirname, "./.tmp/ts.ts"), "   export const v:             number =             1");
  });
});
