import { generate } from "@querycap-dev/generate";
import path, { dirname } from "path";
import { css2tsx } from "../";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

describe("css2tsx", () => {
  it("gen", () => {
    const codes = css2tsx("MapboxGLCSS", path.join(__dirname, "../__fixtures__/mapbox-gl.css"), {
      exclude: [".mapboxgl-map"],
    });

    generate(path.join(__dirname, "../__fixtures__/MapboxGLCSS.tsx"), codes);
  });
});
