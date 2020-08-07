import { camelCase, dropRight, last, map, replace, trim, upperFirst } from "lodash";
import path from "path";
import {
  simplifySvg,
  removeComments,
  convertStyleToAttrs,
  cleanupAttrs,
  removeMetas,
  convertShapeToPath,
  cleanupIDs,
  removeEmpties,
  removeTransform,
  removeDefs,
  collapseGroups,
  convertToReactJSX,
} from "@morlay/simplify-svg";

const toUpperCamelCase = (str: string): string => upperFirst(camelCase(str));

const getBasename = (filename: string): string => replace(filename, /(^ic_)|((_black)?([_-]?24px)?(\.svg)?$)/g, "");

const getComponentName = (filename: string): string => `Icon${toUpperCamelCase(getBasename(filename))}`;

const toJSX = (svg: string): string => {
  return simplifySvg(
    svg
      .split("\n")
      .map((s) => trim(s))
      .join(""),
    [
      ($: CheerioStatic) => {
        $("#Adobe_OpacityMaskFilter").remove();
        $("[maskUnits=userSpaceOnUse]").remove();
        $("#Page-1").removeAttr("fill");
        $("[fill=none]").remove();
        $("[opacity=0]").remove();
      },
      removeComments,
      convertStyleToAttrs,
      cleanupAttrs,
      removeMetas,
      convertShapeToPath,
      cleanupIDs,
      removeEmpties,
      removeTransform,
      removeDefs,
      collapseGroups,
      convertToReactJSX,
      ($: CheerioStatic) => {
        $("[fill]").removeAttr("fill");
        $("[enableBackground]").removeAttr("enableBackground");
        $("[xmlns]").removeAttr("xmlns");
        $("[className]").removeAttr("className");
      },
    ],
  );
};

const libMethod = (p = ""): [string, string] => {
  const parts = p.split(".");

  return [dropRight(parts, 1).join("."), last(parts)!];
};

export const svg2tsx = (
  svgs: { [file: string]: string },
  opts: {
    iconCreator: string;
  },
) => {
  const [iconCreateLib, iconCreateMethod] = libMethod(opts.iconCreator);

  return `
import React from "react";
import { ${iconCreateMethod} } from "${iconCreateLib}";

${map(
  svgs,
  (svg, filename) => `export const ${getComponentName(path.basename(filename))} = ${iconCreateMethod}(${toJSX(svg)})`,
).join("\n\n")}
  `;
};
