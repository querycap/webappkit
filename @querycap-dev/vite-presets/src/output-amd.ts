import { Plugin, ResolvedConfig, resolvePackageData, transformWithEsbuild } from "vite";
import type { OutputBundle } from "rollup";
import cheerio from "cheerio";
import { dirname, join } from "path";
import { readFileSync } from "fs";
import { NormalizedOutputOptions, RenderedChunk } from "rollup";
import { paramsOf } from "./plugin-proxy";
import { fileURLToPath } from "url";

const _dirname = dirname(fileURLToPath(import.meta.url));

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const requirejsFile = join(resolvePackageData("requirejs", _dirname, true)?.dir || "", "require.js");

const transformRequireJS = () => {
  return transformWithEsbuild(String(readFileSync(requirejsFile)), requirejsFile, {
    minify: true,
    minifyWhitespace: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    legalComments: "none",
    define: {},
  });
};

const getEntry = (bundle?: OutputBundle) => {
  if (bundle) {
    for (const f in bundle) {
      const c = bundle[f];
      if (c.type == "chunk") {
        if (c.isEntry) {
          return c.fileName;
        }
      }
    }
  }
  return "";
};

const getFilenameByName = (bundle: OutputBundle | undefined, name: string) => {
  if (bundle) {
    for (const f in bundle) {
      const c = bundle[f];
      if (c.name === name) {
        return c.fileName;
      }
    }
  }
  return "";
};

/**
 * output amd instead esm module when build
 */
export const outputAmd = (): Plugin => {
  let config: ResolvedConfig;
  let requireJSRef: string;

  return {
    name: "vite-presets/output-amd",

    config(c) {
      c.build = {
        ...c.build,
        polyfillModulePreload: false,
        polyfillDynamicImport: false,
      };
    },

    configResolved(c) {
      config = c;
    },

    async buildStart() {
      if (config.command !== "build") {
        return undefined;
      }

      const data = await transformRequireJS();

      requireJSRef = this.emitFile({
        name: "require.js",
        source: data.code,
        type: "asset",
      });

      return undefined;
    },

    outputOptions(o) {
      if (config.command !== "build") {
        return undefined;
      }

      o.format = "amd";
      o.amd = {
        autoId: true,
      };
      return o;
    },

    renderChunk(code: string, chunk: RenderedChunk, options: NormalizedOutputOptions) {
      if (options.format === "amd" && chunk.isEntry) {
        let prefix = "";

        // ugly hook
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        if (paramsOf(chunk.facadeModuleId || "").has("web-worker-agent")) {
          prefix = `importScripts("${config.base}${this.getFileName(requireJSRef)}");`;
        }

        return `
${prefix}                
requirejs.config({ baseUrl: "${config.base}" });        
${code}
require(["${chunk.fileName.replace(/\.js$/, "")}"]);       
       `;
      }
      return code;
    },

    transformIndexHtml(html, { bundle }) {
      if (config.command !== "build") {
        return undefined;
      }

      const entryFile = getEntry(bundle);
      const requireJSFile = getFilenameByName(bundle, "require.js");

      const $ = cheerio.load(html, {});

      $(`script[type=module]`).remove();
      $(`link[rel=modulepreload]`).remove();

      $("head").append(`<script src="${config.base}${requireJSFile}"></script>`);
      $("body").append(`<script src="${config.base}${entryFile}"></script>`);

      return $.html();
    },
  };
};
