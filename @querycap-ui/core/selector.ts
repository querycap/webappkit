import { CSSObject, Interpolation } from "@emotion/core";
import { isEmpty, isFunction } from "lodash";
import { Theme } from "./theme";

export type InterpolationBuilder = (t: Theme) => Interpolation;

export const applyStyles = (...interpolations: Array<InterpolationBuilder | Interpolation>) => (
  t: any,
): Interpolation => {
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

export interface CSSObjectWithAliases extends CSSObject {
  marginX: CSSObject["marginTop"];
  marginY: CSSObject["marginTop"];
  paddingX: CSSObject["paddingTop"];
  paddingY: CSSObject["paddingTop"];
  borderRadiusTop: CSSObject["borderTopLeftRadius"];
  borderRadiusBottom: CSSObject["borderTopLeftRadius"];
  borderRadiusLeft: CSSObject["borderTopLeftRadius"];
  borderRadiusRight: CSSObject["borderTopLeftRadius"];
  with: Interpolation;
}

export type Builder<T> = {
  [k in keyof T]-?: (arg: ((t: Theme) => T[k]) | T[k]) => Builder<T>;
} & {
  (t: Theme): Interpolation;
};

const aliases: { [k: string]: Array<keyof CSSObject> } = {
  marginX: ["marginLeft", "marginRight"],
  marginY: ["marginTop", "marginBottom"],
  paddingX: ["paddingLeft", "paddingRight"],
  paddingY: ["paddingTop", "paddingBottom"],
  borderRadiusTop: ["borderTopLeftRadius", "borderTopRightRadius"],
  borderRadiusBottom: ["borderBottomLeftRadius", "borderBottomRightRadius"],
  borderRadiusLeft: ["borderTopLeftRadius", "borderBottomLeftRadius"],
  borderRadiusRight: ["borderTopRightRadius", "borderBottomRightRadius"],
};

export function selector<T = CSSObjectWithAliases>(...selectors: string[]) {
  const n = selectors.length;

  let styleOrBuilders = {} as any;

  const buildStyle = (styleOrBuilders: any) => (t: any): Interpolation => {
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

  const interpolationOrBuilders: Array<InterpolationBuilder | Interpolation> = [];

  const applyTheme = (t: any) => {
    if (!isEmpty(styleOrBuilders)) {
      interpolationOrBuilders.push(buildStyle(styleOrBuilders));
      styleOrBuilders = {};
    }

    const final = applyStyles(...interpolationOrBuilders)(t);

    if (n === 0) {
      return final;
    }

    const finals: Interpolation = {};

    for (const s of selectors) {
      finals[s] = final;
    }

    return finals;
  };

  const builder = new Proxy(applyTheme, {
    get(_, prop) {
      if (prop === "with") {
        return (v: any): any => {
          if (!isEmpty(styleOrBuilders)) {
            interpolationOrBuilders.push(buildStyle(styleOrBuilders));
            styleOrBuilders = {};
          }
          interpolationOrBuilders.push(v);
          return builder;
        };
      }
      return (v: any): any => {
        styleOrBuilders[prop as any] = v;
        return builder;
      };
    },
  });

  return builder as Builder<T>;
}
