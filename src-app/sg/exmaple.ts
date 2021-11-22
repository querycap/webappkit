import { forEach, isFunction, pickBy, values } from "lodash";
import { FunctionComponent } from "react";

interface ModuleExamples {
  [k: string]: { [k: string]: FunctionComponent };
}

const modules = (import.meta as any).globEager(
  "../../{@querycap,@querycap-ui}/{*/,**/}__examples__/*{.ts,.tsx}",
) as ModuleExamples;

export interface IExample {
  group: string;
  module: string;
  name: string;
  source?: string;
  examples: { [k: string]: FunctionComponent };
}

const getGroupModuleComponent = (key: string) => {
  const result = key.replace(/\.tsx?$/g, "").split("/");

  for (let i = 0; i < result.length; i++) {
    if (result[i].startsWith("@")) {
      return [result[i], result[i + 1], result[result.length - 1]];
    }
  }
  return [];
};

const collect = (modules: ModuleExamples): IExample[] => {
  const results: { [k: string]: IExample } = {};

  forEach(modules, (examples, path) => {
    const [group, module, name] = getGroupModuleComponent(path);

    const e = {
      group: group,
      module: module,
      name: name,
      examples: pickBy(examples, isFunction),
    };

    results[`${e.group}/${e.module}/${e.name}`] = e;
  });

  return values(results);
};

export const examples = collect(modules);
