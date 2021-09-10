import { forEach, pickBy, values, last, isFunction } from "lodash";
import { FunctionComponent } from "react";

const groups = {
  "@querycap": [
    (require as any).context(`./examples/@querycap/`, true, /\/__examples__\/(.+)\.tsx?$/),
    (require as any).context(`!!raw-loader!./examples/@querycap/`, true, /\/__examples__\/(.+)\.tsx?$/),
  ] as const,
  "@querycap-ui": [
    (require as any).context(`./examples/@querycap-ui/`, true, /\/__examples__\/(.+)\.tsx?$/),
    (require as any).context(`!!raw-loader!./examples/@querycap-ui/`, true, /\/__examples__\/(.+)\.tsx?$/),
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
  const results: { [k: string]: IExample } = {};

  forEach(examples, ([req, reqSrc], group) => {
    forEach(req.keys(), (keyPath) => {
      const key = keyPath.replace(`src-app/sg/examples/${group}/`, "./");
      const examples = req(key);

      const e = {
        group: group,
        module: getModuleName(key),
        name: getComponentName(key),
        source: examples.NOSRC ? undefined : reqSrc(key).default,
        examples: pickBy(examples, isFunction),
      };

      results[`${e.group}/${e.module}/${e.name}`] = e;
    });
  });

  return values(results);
};

export const examples = collect(groups);
