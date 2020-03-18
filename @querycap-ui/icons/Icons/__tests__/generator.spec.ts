import { generate, loadFiles } from "@querycap-dev/generate";
import { svg2tsx } from "@querycap-dev/generate-svg2tsx";

describe("generate", () => {
  it("Icon Components", () => {
    const files = loadFiles(["./icons/*.svg"], { cwd: __dirname });

    const codes = svg2tsx(files, {
      iconCreator: "../Graph.createIcon",
    });

    generate("../index.tsx", codes, { cwd: __dirname });
  });
});
