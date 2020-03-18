import { ThemeContext } from "@emotion/core";
import { isFunction, mapValues } from "lodash";
import { parseToRgb } from "polished";
import React, { useContext, useMemo } from "react";
import { colors } from "./colors";

const fontStack = (...fonts: string[]) => fonts.map((font) => (font.includes(" ") ? `"${font}"` : font)).join(", ");

export const theme = {
  space: {
    s0: 0,
    s1: 4,
    s2: 8,
    s3: 16,
    s4: 24,
    s5: 32,
    s6: 40,
    s7: 48,
    s8: 64,
    s9: 80,
    s10: 96,
    s11: 112,
    s12: 128,
  },

  fonts: {
    normal: fontStack(
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Helvetica",
      "PingFang SC",
      "Hiragino Sans GB",
      "Microsoft YaHei",
      "SimSun",
      "sans-serif",
    ),

    mono: fontStack(
      "Menlo",
      "Liberation Mono",
      "Consolas",
      "DejaVu Sans Mono",
      "Ubuntu Mono",
      "Courier New",
      "andale mono",
      "lucida console",
      "monospace",
    ),
  },

  fontWeights: {
    light: 300,
    normal: 400,
    bold: 500,
  },

  fontSizes: {
    xs: 12,
    s: 14,
    normal: 16,
    m: 20,
    l: 24,
    xl: 30,
    xxl: 38,
  },

  lineHeights: {
    condensedUltra: 1,
    condensed: 1.25,
    normal: 1.5,
  },

  colors: {
    ...colors,

    primary: colors.blue6,
    success: colors.green6,
    warning: colors.yellow6,
    danger: colors.red6,
    info: colors.gray6,

    textLight: colors.white,
    textDark: colors.black,
    bgDark: colors.darkBlue9,
    bgLight: colors.gray2,

    text: colors.black,
    bg: colors.gray2,

    border: colors.gray2,
  },
};

export type Theme = typeof theme;

export const themes: {
  [S in keyof Theme]: {
    [V in keyof Theme[S]]: (t: Theme) => Theme[S][V];
  };
} = mapValues(theme, (values, s) => {
  return mapValues(values, (_, v) => {
    return (t: any) => {
      return t[s][v];
    };
  });
}) as any;

// https://en.wikipedia.org/wiki/Grayscale
const grayscale = (color: string) => {
  const { red, green, blue } = parseToRgb(color);
  return red * 0.299 + green * 0.587 + blue * 0.114;
};

export const safeTextColor = (bg: string) => (t: Theme) => {
  return grayscale(bg) > 160 ? t.colors.textDark : t.colors.textLight;
};

export const ThemeProvider = (props: { theme?: Theme; children?: React.ReactNode }) => (
  <ThemeContext.Provider value={props.theme || theme}>{props.children}</ThemeContext.Provider>
);

export const useTheme = (): Theme => {
  return (useContext(ThemeContext) as any) || theme;
};

export const WithBackground = ({
  color,
  children,
}: {
  color: string | ((t: Theme) => string);
  children?: React.ReactNode;
}) => {
  const t = useTheme();

  const c = isFunction(color) ? color(t) : color;

  const next = useMemo(
    (): Theme => ({
      ...t,
      colors: {
        ...t.colors,
        bg: c,
        text: safeTextColor(c)(t),
      },
    }),
    [c],
  );

  return <ThemeProvider theme={next}>{children}</ThemeProvider>;
};
