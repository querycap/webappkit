import { forEach, pickBy, last, isFunction } from "lodash";
import { FunctionComponent } from "react";

const groups = {
  "@querycap": [
    (require as any).context(`@querycap/`, true, /\/__examples__\/(.+)\.tsx?$/),
    (require as any).context(`!!raw-loader!@querycap/`, true, /\/__examples__\/(.+)\.tsx?$/),
  ] as const,
  "@querycap-ui": [
    (require as any).context(`@querycap-ui/`, true, /\/__examples__\/(.+)\.tsx?$/),
    (require as any).context(`!!raw-loader!@querycap-ui/`, true, /\/__examples__\/(.+)\.tsx?$/),
  ] as const,
};

export interface IExample {
  group: string;
  module: string;
  name: string;

  source?: string;
  examples: { [k: string]: FunctionComponent };
}

const getModuleName = (key: string) => {
  const result = key.replace(/\.tsx?$/g, "").split("/");
  return `${result[1]}`;
};

const getComponentName = (key: string) => {
  const result = key.replace(/\.tsx?$/g, "").split("/");
  return `${last(result)}`;
};

const collect = (examples: { [k: string]: readonly [any, any] }): IExample[] => {
  const results: IExample[] = [];

  forEach(examples, ([req, reqSrc], group) => {
    forEach(req.keys(), (key) => {
      const examples = req(key);

      results.push({
        group: group,
        module: getModuleName(key),
        name: getComponentName(key),
        source: examples.NOSRC ? undefined : reqSrc(key).default,
        examples: pickBy(examples, isFunction),
      });
    });
  });

  return results;
};

export const examples = collect(groups);
