import { CSSObject, ThemeContext } from "@emotion/core";
import { endsWith } from "lodash";
import React, { ComponentType, ReactNode, useContext, useMemo } from "react";

const color = {
  primary: "#19C7B1",
  secondary: "#27326C",
  success: "#4CD964",
  warning: "#F1911E",
  info: "#A9AEFC",
  danger: "#E51D30",

  text: "#333",
  border: "#e8e8e8",
  bg: "#ffffff",
};

const colorReverse = {
  ...color,
  text: "#FFFFFF",
  border: "#22243B",
  bg: "#000000",
};

export const theme = {
  fontFamily: {
    system: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimSun, sans-serif`,
    mono: `"Menlo", "Liberation Mono", "Consolas", "DejaVu Sans Mono", "Ubuntu Mono", "Courier New", "andale mono", "lucida console", monospace`,
  },

  weight: {
    bold: "bold" as CSSObject["fontWeight"],
    normal: "normal" as CSSObject["fontWeight"],
  },

  size: {
    xxs: 10,
    xs: 12,
    s: 14,
    b: 16,
    m: 18,
    l: 24,
    xl: 36,
    xxl: 48,
  },

  color,
  color$$: color,
  colorReverse,
  colorReverse$$: colorReverse,

  radius: {
    s: 2,
    b: 4,
    m: 8,
  },

  spacing: {
    base: "0.6em 1em",
  },
};

function reverse<T>(settings: T): T {
  const nextSettings: any = {};

  for (const k in settings) {
    const val = settings[k];

    if (endsWith(k, "Reverse")) {
      continue;
    }

    if ((settings as any)[`${k}Reverse`]) {
      nextSettings[k] = {
        ...val,
        ...(settings as any)[`${k}Reverse`],
      };

      nextSettings[`${k}Reverse`] = {
        ...(settings as any)[`${k}Reverse`],
        ...val,
      };

      continue;
    }

    nextSettings[k] = val;
  }

  return nextSettings;
}

export type Theme = typeof theme;

export const ThemeProvider = (props: { theme?: Theme; children: React.ReactNode }) => (
  <ThemeContext.Provider value={props.theme || theme}>{props.children}</ThemeContext.Provider>
);

export const useTheme = (): Theme => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  return useContext(ThemeContext) as any;
};

export const ThemeReverse = ({ children }: { children?: ReactNode }) => {
  const ds = useTheme();
  const r = useMemo(() => reverse(ds), []);
  return <ThemeProvider theme={r}>{children}</ThemeProvider>;
};

export function withThemeReverse<TProps>(Comp: ComponentType<TProps>) {
  return (props: TProps) => (
    <ThemeReverse>
      <Comp {...props} />
    </ThemeReverse>
  );
}
