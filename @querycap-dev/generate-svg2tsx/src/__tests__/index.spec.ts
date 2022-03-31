import { generate, loadFiles } from "@querycap-dev/generate";
import { svg2tsx } from "@querycap-dev/generate-svg2tsx";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("svg2tsx", () => {
  it("gen", () => {
    const files = loadFiles(["./icons/*.svg"], { cwd: __dirname });

    const codes = svg2tsx(files, {
      iconCreator: "./Icon.createIcon",
    });

    generate("./Icons.tsx", codes, { cwd: __dirname });
  });
});
