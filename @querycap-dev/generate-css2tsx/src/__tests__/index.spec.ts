import { generate } from "@querycap-dev/generate";
import path from "path";
import { css2tsx } from "../";

describe("css2tsx", () => {
  it("gen", () => {
    const codes = css2tsx("MapboxGLCSS", path.join(__dirname, "../__fixtures__/mapbox-gl.css"), {
      exclude: [".mapboxgl-map"],
    });

    generate(path.join(__dirname, "../__fixtures__/MapboxGLCSS.tsx"), codes);
  });
});
