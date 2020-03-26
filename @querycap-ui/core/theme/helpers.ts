// https://en.wikipedia.org/wiki/Grayscale
import { curry } from "lodash";
import { parseToRgb, shade, tint } from "polished";

export const grayscaleValue = (color: string) => {
  const { red, green, blue } = parseToRgb(color);
  return red * 0.299 + green * 0.587 + blue * 0.114;
};

export const tintOrShade = curry((p: number, backgroundColor: string) =>
  (grayscaleValue(backgroundColor) < 256 / 2 ? tint : shade)(p, backgroundColor),
);

export const safeTextColor = (backgroundColor: string) => {
  return (grayscaleValue(backgroundColor) < 256 - 60 ? tint : shade)(0.95, backgroundColor);
};

export const negative = (v: number) => -v;

export const roundedEm = curry((em: number, v: number) => Math.round(em * v));

export const simpleShadow = curry((sizes: string, color: string) => `${sizes} ${color}`);
