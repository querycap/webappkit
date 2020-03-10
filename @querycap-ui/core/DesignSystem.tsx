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
    base: 16,
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
    base: 4,
    m: 8,
  },

  spacing: {
    base: "0.6em 1em",
  },

  shadow: {
    dp2: `0 2px 2px 0 rgba(0, 0, 0, .04), 0 3px 1px -2px rgba(0, 0, 0, .2), 0 1px 5px 0 rgba(0, 0, 0, .12)`,
    dp3: `0 3px 4px 0 rgba(0, 0, 0, .04), 0 3px 3px -2px rgba(0, 0, 0, .2), 0 1px 8px 0 rgba(0, 0, 0, .12)`,
    dp4: `0 4px 5px 0 rgba(0, 0, 0, .04), 0 1px 10px 0 rgba(0, 0, 0, .12), 0 2px 4px -1px rgba(0, 0, 0, .2)`,
    dp6: `0 6px 10px 0 rgba(0, 0, 0, .04), 0 1px 18px 0 rgba(0, 0, 0, .12), 0 3px 5px -1px rgba(0, 0, 0, .2)`,
    dp8: `0 8px 10px 1px rgba(0, 0, 0, .04), 0 3px 14px 2px rgba(0, 0, 0, .12), 0 5px 5px -3px rgba(0, 0, 0, .2)`,
    dp16: `0 16px 24px 2px rgba(0, 0, 0, .04), 0 6px 30px 5px rgba(0, 0, 0, .12), 0 8px 10px -5px rgba(0, 0, 0, .2)`,
    dp24: `0 9px 46px 8px rgba(0, 0, 0, .04), 0 11px 15px -7px rgba(0, 0, 0, .12), 0 24px 38px 3px rgba(0, 0, 0, .2)`,
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

export type TTheme = typeof theme;

export function ThemeProvider(props: { theme?: TTheme; children: React.ReactNode }) {
  return <ThemeContext.Provider value={props.theme || theme}>{props.children}</ThemeContext.Provider>;
}

export function useDesignSystem(): TTheme {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  return useContext(ThemeContext) as any;
}

export function DesignSystemColorReverse({ children }: { children?: ReactNode }) {
  const ds = useDesignSystem();
  const r = useMemo(() => reverse(ds), []);
  return <ThemeProvider theme={r}>{children}</ThemeProvider>;
}

export function withDesignSystemReverse<TProps>(Comp: ComponentType<TProps>) {
  return function DesignSystemReverse(props: TProps) {
    return (
      <DesignSystemColorReverse>
        <Comp {...props} />
      </DesignSystemColorReverse>
    );
  };
}
