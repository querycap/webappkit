import { Interpolation } from "@emotion/core";
import { isEmpty, isFunction } from "lodash";
import { CSSProperties } from "react";
import { Theme } from "./theme";

export type InterpolationBuilder = (t: Theme) => Interpolation;

const applyStyles = (...interpolations: Array<InterpolationBuilder | Interpolation>) => (t: any): Interpolation => {
  const styles: Interpolation[] = [];

  for (const interpolation of interpolations) {
    styles.push(isFunction(interpolation) ? interpolation(t) : interpolation);
  }

  if (styles.length === 0) {
    return {};
  }

  if (styles.length === 1) {
    return styles[0];
  }

  return styles;
};

export interface CSSPropertiesWithAliases extends CSSProperties {
  colorFill: CSSProperties["color"];
  marginX: CSSProperties["marginTop"];
  marginY: CSSProperties["marginTop"];
  paddingX: CSSProperties["paddingTop"];
  paddingY: CSSProperties["paddingTop"];
  borderTopRadius: CSSProperties["borderTopLeftRadius"];
  borderBottomRadius: CSSProperties["borderTopLeftRadius"];
  borderLeftRadius: CSSProperties["borderTopLeftRadius"];
  borderRightRadius: CSSProperties["borderTopLeftRadius"];
}

export interface BuilderProperties extends CSSPropertiesWithAliases {
  with: Interpolation;
}

export type CSSBuilder = {
  [k in keyof BuilderProperties]-?: (arg: ((t: Theme) => BuilderProperties[k]) | BuilderProperties[k]) => CSSBuilder;
} & {
  (t: Theme): Interpolation;
};

const aliases: { [k: string]: Array<keyof CSSProperties> } = {
  colorFill: ["color", "fill"],
  marginX: ["marginLeft", "marginRight"],
  marginY: ["marginTop", "marginBottom"],
  paddingX: ["paddingLeft", "paddingRight"],
  paddingY: ["paddingTop", "paddingBottom"],
  borderTopRadius: ["borderTopLeftRadius", "borderTopRightRadius"],
  borderBottomRadius: ["borderBottomLeftRadius", "borderBottomRightRadius"],
  borderLeftRadius: ["borderTopLeftRadius", "borderBottomLeftRadius"],
  borderRightRadius: ["borderTopRightRadius", "borderBottomRightRadius"],
};

type StyleOrBuilderSet = {
  [k: string]: any | ((t: any) => any);
};

const buildStyle = (styleOrBuilders: StyleOrBuilderSet) => (t: any): Interpolation => {
  const styles = {} as any;

  for (const prop in styleOrBuilders) {
    const styleOrBuilder = styleOrBuilders[prop];
    const value = isFunction(styleOrBuilder) ? styleOrBuilder(t) : styleOrBuilder;

    if (aliases[prop]) {
      for (const p of aliases[prop]) {
        styles[p] = value;
      }
    } else {
      styles[prop] = value;
    }
  }

  return styles;
};

const createBuilder = (
  selectors: readonly string[],
  styleOrBuilders: StyleOrBuilderSet = {},
  interpolationOrBuilders: ReadonlyArray<InterpolationBuilder | Interpolation> = [],
) => {
  const applyTheme = (t: any) => {
    const n = selectors.length;

    const final = applyStyles(
      ...(isEmpty(styleOrBuilders)
        ? interpolationOrBuilders
        : [...interpolationOrBuilders, buildStyle(styleOrBuilders)]),
    )(t);

    if (n === 0) {
      return final;
    }

    const finals: Interpolation = {};

    for (const s of selectors) {
      finals[s] = final;
    }

    return finals;
  };

  return new Proxy(applyTheme, {
    get(_, prop) {
      if (prop === "with") {
        return (v: any): any => {
          return createBuilder(
            selectors,
            {},
            !isEmpty(styleOrBuilders)
              ? [...interpolationOrBuilders, buildStyle(styleOrBuilders), v]
              : [...interpolationOrBuilders, v],
          );
        };
      }

      return (v: any): any => {
        const nextStyleOrBuilders: StyleOrBuilderSet = {};
        for (const prop in styleOrBuilders) {
          nextStyleOrBuilders[prop] = styleOrBuilders[prop];
        }
        nextStyleOrBuilders[prop as any] = v;
        return createBuilder(selectors, nextStyleOrBuilders, interpolationOrBuilders);
      };
    },
  }) as CSSBuilder;
};

export function selector(...selectors: readonly string[]): CSSBuilder {
  return createBuilder(selectors, {}, []);
}
