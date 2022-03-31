import path, { dirname } from "path";
import { generate } from "..";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("#generate", () => {
  it("generate ts", () => {
    generate(path.join(__dirname, "./.tmp/ts.ts"), "   export const v:             number =             1");
  });
});
