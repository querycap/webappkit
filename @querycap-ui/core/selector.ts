import { CSSObject, Interpolation } from "@emotion/core";
import { isFunction } from "lodash";
import { Theme } from "./theme";

export type InterpolationBuilder = (t: Theme) => Interpolation;

export const applyStyles = (...interpolations: Array<InterpolationBuilder | Interpolation>) => (
  t: any,
): Interpolation => {
  const styles: Interpolation[] = [];

  for (const interpolation of interpolations) {
    styles.push(isFunction(interpolation) ? interpolation(t) : interpolation);
  }

  return styles;
};

export interface CSSObjectWithAliases extends CSSObject {
  marginX: CSSObject["marginTop"];
  marginY: CSSObject["marginTop"];
  paddingX: CSSObject["paddingTop"];
  paddingY: CSSObject["paddingTop"];
}

export type Builder<T> = {
  [k in keyof T]-?: (arg: ((t: Theme) => T[k]) | T[k]) => Builder<T>;
} & {
  (t: Theme): Interpolation;
};

const aliases: { [k: string]: string[] } = {
  marginX: ["marginLeft", "marginRight"],
  marginY: ["marginTop", "marginBottom"],
  paddingX: ["paddingLeft", "paddingRight"],
  paddingY: ["paddingTop", "paddingBottom"],
};

export function selector<T = CSSObjectWithAliases>(...selectors: string[]) {
  const n = selectors.length;

  const styleOrBuilders = {} as any;

  const applyTheme = (t: any) => {
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

    if (n === 0) {
      return styles;
    }

    const finals: Interpolation = {};

    for (const s of selectors) {
      finals[s] = styles;
    }

    return finals;
  };

  const builder = new Proxy(applyTheme, {
    get(_, prop) {
      return (v: any): any => {
        styleOrBuilders[prop as any] = v;
        return builder;
      };
    },
  });

  return builder as Builder<T>;
}
