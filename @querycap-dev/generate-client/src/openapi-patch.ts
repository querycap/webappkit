import { IOpenAPI, TParameter } from "@querycap-dev/ts-gen-client-from-openapi";
import { filter, forEach, map, mapKeys, mapValues } from "lodash";

export const patchOpenAPI = (
  openapi: IOpenAPI,
  {
    filterParameter,
    ignorePaths = ["/er"],
  }: Partial<{
    filterParameter: (p: TParameter) => boolean;
    ignorePaths: string[];
  }>,
): any => {
  let paths = mapKeys(openapi.paths, (_: any, pathString: string): string =>
    openapi.basePath && openapi.basePath !== "/" ? `${openapi.basePath}${pathString}` : pathString,
  );

  paths = mapValues(paths, (pathItems) => {
    return mapValues(pathItems, (operation) => {
      return {
        ...operation,
        parameters: map(filter(operation.parameters, filterParameter), (p) => {
          if (p.in === "query") {
            if (p.schema.items) {
              p.schema = {
                oneOf: [
                  p.schema.items,
                  {
                    type: "array",
                    items: p.schema.items,
                  },
                ],
              };
            }
          }
          return p;
        }),
      };
    });
  });

  forEach(ignorePaths, (p) => {
    delete paths[p];
  });

  return {
    ...openapi,
    paths,
  };
};
