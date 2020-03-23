import { ThemeContext } from "@emotion/core";
import { isFunction, mapValues } from "lodash";
import { parseToRgb } from "polished";
import React, { ReactNode, useContext, useMemo } from "react";
import { colors } from "./colors";

const fontStack = (...fonts: string[]) => fonts.map((font) => (font.includes(" ") ? `"${font}"` : font)).join(", ");

const fontSizes = {
  xs: 12,
  s: 14,
  normal: 16,
  m: 20,
  l: 24,
  xl: 30,
  xxl: 38,
};

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

  radii: {
    s: 2,
    normal: 4,
    l: 8,
  },

  fontSizes: {
    ...fontSizes,

    text: fontSizes.normal,
  },

  lineHeights: {
    condensedUltra: 1,
    condensed: 1.25,
    normal: 1.5,
  },

  shadows: {
    normal: "0 1px 1px rgba(27,31,35,0.1)",
    medium: "0 1px 5px rgba(27,31,35,0.15)",
    large: "0 1px 15px rgba(27,31,35,0.15)",
    extraLarge: "0 10px 50px rgba(27,31,35,0.15)",
  },

  colors: {
    ...colors,

    primary: colors.blue6,
    success: colors.green5,
    warning: colors.yellow5,
    danger: colors.red5,
    info: colors.gray5,

    textLight: colors.white,
    textDark: colors.black,
    bgDark: colors.darkBlue9,
    bgLight: colors.gray2,

    text: colors.black,
    bg: colors.white,

    border: colors.gray2,
  },
};

export interface Theme extends Readonly<typeof theme> {}

export type ValueOrThemeGetter<T> = T | ((t: Theme) => T);

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

export const safeTextColor = (bg: ValueOrThemeGetter<string>) => (t: Theme) => {
  return grayscale(isFunction(bg) ? bg(t) : bg) > 160 ? t.colors.textDark : t.colors.textLight;
};

export const ThemeProvider = (props: { theme?: Theme; children?: React.ReactNode }) => (
  <ThemeContext.Provider value={props.theme || theme}>{props.children}</ThemeContext.Provider>
);

export const useTheme = (): Theme => {
  return (useContext(ThemeContext) as any) || theme;
};

export const withTheme = (
  theme: {
    [S in keyof Theme]?: {
      [V in keyof Theme[S]]?: Theme[S][V] | ((t: Theme) => Theme[S][V]);
    };
  },
) => {
  return ({ children }: { children?: ReactNode }) => {
    const t = useTheme();

    const next = useMemo((): Theme => {
      const next: any = {};

      for (const group in t) {
        const values = (t as any)[group];
        next[group] = {};

        for (const key in values) {
          const n = ((theme as any)[group] || {})[key];

          next[group][key] = n ? (isFunction(n) ? n(t) : n) : values[key];
        }
      }

      return next;
    }, []);

    return <ThemeProvider theme={next}>{children}</ThemeProvider>;
  };
};

export const withBackground = (bg: string | ((t: Theme) => string)) =>
  withTheme({
    colors: {
      bg: bg,
      text: safeTextColor(bg),
    },
  });
