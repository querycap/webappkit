import { readFileSync } from "fs";
import { camelCase, Dictionary, forEach, includes, map, startsWith, toNumber, trim, upperFirst } from "lodash";
import { dirname, relative, resolve } from "path";
import { Declaration, Node, parse, Rule } from "postcss";

const isDeclNode = (node: Node): node is Declaration => {
  return node.type === "decl";
};

const stringifyJSObject = (o: Dictionary<string>): string => {
  let rules = `{
`;

  forEach(o, (v, k) => {
    if (startsWith(v, `"`)) {
      if (k === "content") {
        rules += `${JSON.stringify(k)}: ${v},`;
        return;
      }
      v = trim(v, `"`);
      if (k === "content") {
        console.log(v, k);
      }

      const n = toNumber(v);
      rules += `${JSON.stringify(k)}: ${!isNaN(n) ? n : `"${v}"`},
`;
      return;
    }

    rules += `${JSON.stringify(k)}: ${v},
`;
  });

  rules += `}`;

  return rules;
};

const resolveURL = (filename: string) => {
  if (filename.includes("node_modules")) {
    return relative((process.cwd(), "node_modules"), filename);
  }
  return filename;
};

const toCSSProp = (k: string) => {
  if (k.startsWith("-")) {
    return upperFirst(camelCase(k));
  }
  return camelCase(k);
};

const reUrl = /url\(([^)]+)\)/;

export const css2tsx = (name: string, filename: string, opts: { exclude?: string[] } = {}) => {
  const css = String(readFileSync(filename));
  const selectors: { [key: string]: any } = {};

  const baseDir = dirname(filename);

  (parse(css).nodes || [])
    .filter((node: Node): node is Rule => node.type === "rule")
    .forEach((rule) => {
      const selector = rule.selector.replace(/\r\n/g, " ").replace(/:first-child/g, ":first-of-type");

      if (opts.exclude && includes(opts.exclude, selector)) {
        return;
      }

      const rules: Dictionary<string> = {};

      rule.walk((node) => {
        if (isDeclNode(node)) {
          const prop = toCSSProp(node.prop);

          rules[prop] = JSON.stringify(node.value);
          if (prop === "content") {
            // console.log(prop, node.value, rules[prop]);
          }
          const matched = reUrl.exec(node.value);

          if (matched) {
            const imageRelFilename = matched[1];

            if (!(imageRelFilename.startsWith("#") || imageRelFilename.includes("data:image"))) {
              rules[prop] = node.value.replace(reUrl, `require("${resolveURL(resolve(baseDir, imageRelFilename))}")`);
            }
          }
        }
      });

      selectors[selector.replace(/\n/g, " ")] = stringifyJSObject(rules);
    });

  return `
import React from "react";
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { Global } from "@emotion/core";

export const ${name} = () => (
  <>
${map(
  selectors,
  (rule, k) => `
<Global 
  styles={{ 
    ${JSON.stringify(k)}: ${rule}
  }} 
/>
`,
).join("\n")}
  </>
)
  `;
};
