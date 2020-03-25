import { ThemeContext } from "@emotion/core";
import { isFunction, mapValues } from "lodash";
import { parseToRgb, rgba, shade, tint } from "polished";
import React, { FunctionComponent, ReactNode, useContext, useMemo } from "react";
import { colors } from "./colors";

export { colors };

const fontStack = (...fonts: string[]) => fonts.map((font) => (font.includes(" ") ? `"${font}"` : font)).join(", ");

// https://en.wikipedia.org/wiki/Grayscale
export const grayscaleValue = (color: string) => {
  const { red, green, blue } = parseToRgb(color);
  return red * 0.299 + green * 0.587 + blue * 0.114;
};

export const tintOrShade = (p: number, backgroundColor: string, breakpoint = 256 / 2) =>
  (grayscaleValue(backgroundColor) < breakpoint ? tint : shade)(p, backgroundColor);

const _safeTextColor = (bg: string) => {
  return tintOrShade(0.875, bg, 255 - 60);
};

export const safeTextColor = (bg: ValueOrThemeGetter<string>) => (t: Theme) => {
  return _safeTextColor(isFunction(bg) ? bg(t) : bg);
};

const fontSizes = {
  xs: 12,
  s: 14,
  normal: 16,
  m: 20,
  l: 24,
  xl: 30,
  xxl: 38,
};

const state = {
  fontSize: fontSizes.normal,
  borderColor: colors.gray2,
  backgroundColor: colors.white,
  color: _safeTextColor(colors.white),
};

export const theme = {
  state: state,

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
      "Arial",
      "Noto Sans",
      "sans-serif",
      "Apple Color Emoji",
      "Segoe UI Emoji",
      "Segoe UI Symbol",
      "Noto Color Emoji",
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

  radii: {
    s: 2,
    normal: 4,
    l: 8,
  },

  colors: {
    primary: colors.blue6,
    success: colors.green5,
    warning: colors.yellow5,
    danger: colors.red5,
    info: colors.gray5,
  },

  fontWeights: {
    light: 300,
    normal: 400,
    bold: 500,
  },

  fontSizes: fontSizes,

  lineHeights: {
    condensedUltra: 1,
    condensed: 1.25,
    normal: 1.5,
  },
};

export interface Theme extends Readonly<typeof theme> {}

export const shadows = {
  normal: (t: Theme) => `0 1px 1px ${rgba(tintOrShade(0.3, t.state.backgroundColor), 0.1)}`,
  medium: (t: Theme) => `0 1px 5px ${rgba(tintOrShade(0.3, t.state.backgroundColor), 0.15)}`,
  large: (t: Theme) => `0 1px 15px ${rgba(tintOrShade(0.3, t.state.backgroundColor), 0.17)}`,
  extraLarge: (t: Theme) => `0 10px 50px ${rgba(tintOrShade(0.3, t.state.backgroundColor), 0.2)}`,
};

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

export const ThemeProvider = (props: { theme?: Theme; children?: React.ReactNode }) => (
  <ThemeContext.Provider value={props.theme || theme}>{props.children}</ThemeContext.Provider>
);

export const useTheme = (): Theme => {
  return (useContext(ThemeContext) as any) || theme;
};

export const ThemeState = ({
  children,
  ...state
}: {
  [V in keyof Theme["state"]]?: Theme["state"][V] | ((t: Theme) => Theme["state"][V]);
} & {
  children: ReactNode;
}) => {
  const t = useTheme();

  const next = useMemo((): Theme => {
    const nextState: any = {};

    for (const key in t.state) {
      const n = (state as any)[key];

      nextState[key] = n ? (isFunction(n) ? n(t) : n) : (t.state as any)[key];
    }

    return {
      ...t,
      state: nextState,
    };
  }, []);

  return <ThemeProvider theme={next}>{children}</ThemeProvider>;
};

export const withThemeState = (
  state: {
    [V in keyof Theme["state"]]?: Theme["state"][V] | ((t: Theme) => Theme["state"][V]);
  },
) => {
  return <T extends any>(Comp: FunctionComponent<T>) => (props: T) => {
    return (
      <ThemeState {...state}>
        <Comp {...props} />
      </ThemeState>
    );
  };
};

export const withBackground = (backgroundColor: string | ((t: Theme) => string)) =>
  withThemeState({
    backgroundColor: backgroundColor,
    color: safeTextColor(backgroundColor),
  });

export const withTextSize = (v: number | ((t: Theme) => number)) =>
  withThemeState({
    fontSize: v,
  });
