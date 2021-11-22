import { ThemeContext } from "@emotion/react";
import { flow, forEach, isFunction, keys, mapValues } from "lodash";
import { rgba, transparentize } from "polished";
import { useContext, useMemo } from "react";
import type { FunctionComponent, ReactNode } from "react";
import { colors } from "./colors";
import { safeTextColor, simpleShadow, tintOrShade } from "./helpers";

export type ValueOrThemeGetter<T> = T | ((t: Theme) => T);

export function fromTheme<T>(valueOrGetter: ValueOrThemeGetter<T>) {
  return (t: Theme) => {
    return isFunction(valueOrGetter) ? valueOrGetter(t) : valueOrGetter;
  };
}

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

const lineHeights = {
  condensedUltra: 1,
  condensed: 1.25,
  normal: 1.5,
};

const state = {
  lineHeight: lineHeights.normal,
  fontSize: fontSizes.normal,
  color: safeTextColor(colors.white),
  borderColor: rgba(safeTextColor(colors.white), 0.1),
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

  fontSizes,

  lineHeights,
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
  normal: flow(theme.state.color, tintOrShade(0.2), transparentize(0.75), simpleShadow("0 1px 1px")),
  medium: flow(theme.state.color, tintOrShade(0.2), transparentize(0.65), simpleShadow("0 1px 4px")),
  large: flow(theme.state.color, tintOrShade(0.2), transparentize(0.65), simpleShadow("0 1px 12px")),
  extraLarge: flow(theme.state.color, tintOrShade(0.2), transparentize(0.65), simpleShadow("0 8px 12px")),
};

export const roundedEm = (em: number) => (t: Theme) => Math.round(em * t.state.fontSize);

export const ThemeProvider = (props: { theme?: Theme; children?: ReactNode }) => (
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      nextState.color = safeTextColor(nextState.backgroundColor);
    }

    return {
      ...t,
      state: nextState,
    };
  }, deps);

  return <ThemeProvider theme={next}>{children}</ThemeProvider>;
};

export const withThemeState = (state: {
  [V in keyof Theme["state"]]?: Theme["state"][V] | ((t: Theme) => Theme["state"][V]);
}) => {
  return <T extends {}>(Comp: FunctionComponent<T>) =>
    (props: T) => {
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
