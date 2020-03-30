import { ThemeContext } from "@emotion/core";
import { flow, forEach, isFunction, keys, mapValues } from "lodash";
import { rgba, transparentize } from "polished";
import React, { FunctionComponent, ReactNode, useContext, useMemo } from "react";
import { colors } from "./colors";
import { safeTextColor, simpleShadow, tintOrShade } from "./helpers";

export type ValueOrThemeGetter<T> = T | ((t: Theme) => T);

export const fromTheme = <T extends any>(valueOrGetter: ValueOrThemeGetter<T>) => (t: Theme) => {
  return isFunction(valueOrGetter) ? valueOrGetter(t) : valueOrGetter;
};

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

const state = {
  fontSize: fontSizes.normal,
  borderColor: rgba(safeTextColor(colors.white), 0.1),
  color: safeTextColor(colors.white),
  backgroundColor: colors.white,
};

export const defaultTheme = {
  state: state,

  colors: {
    primary: colors.blue6,
    success: colors.green5,
    warning: colors.yellow5,
    danger: colors.red5,
    info: colors.gray5,
  },

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

export interface Theme extends Readonly<typeof defaultTheme> {}

export const theme: {
  [S in keyof Theme]: {
    [V in keyof Theme[S]]: (t: Theme) => Theme[S][V];
  };
} = mapValues(defaultTheme, (values, s) => {
  return mapValues(values, (_, v) => {
    return (t: any) => {
      return t[s][v];
    };
  });
}) as any;

export const shadows = {
  normal: flow(theme.state.backgroundColor, tintOrShade(0.2), transparentize(0.8), simpleShadow("0 1px 1px")),
  medium: flow(theme.state.backgroundColor, tintOrShade(0.2), transparentize(0.75), simpleShadow("0 1px 5px")),
  large: flow(theme.state.backgroundColor, tintOrShade(0.2), transparentize(0.75), simpleShadow("0 1px 15px")),
  extraLarge: flow(theme.state.backgroundColor, tintOrShade(0.2), transparentize(0.75), simpleShadow("0 10px 15px")),
};

export const ThemeProvider = (props: { theme?: Theme; children?: React.ReactNode }) => (
  <ThemeContext.Provider value={props.theme || defaultTheme}>{props.children}</ThemeContext.Provider>
);

export const useTheme = (): Theme => {
  return (useContext(ThemeContext) as any) || defaultTheme;
};

const themeStateKeys = keys(defaultTheme.state);

export const ThemeState = ({
  children,
  root,
  autoColor,
  ...state
}: {
  [V in keyof Theme["state"]]?: ValueOrThemeGetter<Theme["state"][V]>;
} & {
  children: ReactNode;
  root?: boolean;
  autoColor?: boolean;
}) => {
  const t = useTheme();

  const deps: any[] = [t];

  const nextState = {} as any;

  forEach(themeStateKeys, (k) => {
    const n = (state as any)[k];

    nextState[k] = n ? (isFunction(n) ? n(t) : n) : (t.state as any)[k];

    deps.push(nextState[k]);
  });

  const next = useMemo((): Theme => {
    if (autoColor) {
      nextState.color = safeTextColor(nextState.backgroundColor);
    }

    return {
      ...t,
      state: nextState,
    };
  }, deps);

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

export const withBackground = (backgroundColor: ValueOrThemeGetter<string>) =>
  withThemeState({
    backgroundColor: backgroundColor,
    color: flow(fromTheme(backgroundColor), safeTextColor),
  });

export const withTextSize = (v: number | ((t: Theme) => number)) =>
  withThemeState({
    fontSize: v,
  });
