import type { LoadResult } from "rollup";
import { Plugin } from "vite";
import { readFileSync } from "fs";
import { wrap, importMetaFileURL, paramsOf } from "./plugin-proxy";
import { basename, dirname, extname, join } from "path";

/**
 * auto wrap worker template codes, and use like an esm
 */
export const workerAsModule = (): Plugin => {
  const cache = new Map();

  return wrap({
    name: "vite-presets/worker-as-module",
    enforce: "post",

    transformChunk(code: string, id: string, _?: boolean) {
      if (!paramsOf(id).has("web-worker-agent")) {
        return code;
      }
      return `self.addEventListener("message", function (evt) { ${code} })`;
    },

    resolveImportMeta(property, { format }) {
      if (property === "type") {
        return JSON.stringify(format == "es" ? "module" : "classic");
      }
      return undefined;
    },

    resolveId(source) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      if (paramsOf(source).has("virtual")) {
        return source;
      }
      return;
    },

    load(id: string): LoadResult {
      if (cache.has(id)) {
        return `${cache.get(id)}`;
      }

      const filename = id.split("?")[0];
      const fileExt = extname(filename);
      const filenameWithoutExt = join(dirname(filename), basename(filename, fileExt));

      if (filenameWithoutExt.endsWith("web-worker")) {
        const workerSrc = `${filename}?virtual&web-worker`;
        const workerAgent = `${filenameWithoutExt}.agent${fileExt}?virtual&web-worker-agent`;

        const content = String(readFileSync(id));
        const matched = content.matchAll(/export const ([^ ]+)/g);
        const exports = [...matched].map((ret) => ret[1]);

        cache.set(workerSrc, content);

        cache.set(
          workerAgent,
          `
// avoid vite import preload helper        
const __vitePreload = (s) => s()        

import("${workerSrc}")
  .then((exports) => exports[evt.data.fn](...evt.data.args))
  .then((ret) => self.postMessage(ret));
`,
        );

        return `
const proxy = (...args) => {
  const w = new Worker(${importMetaFileURL(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    this.emitFile({ type: "chunk", id: workerAgent }),
  )}, { type: import.meta.type || "module" })

  return new Promise((resolve, reject) => {
    w.addEventListener("message",({ data }) => {
      resolve(data)
    });
    w.onerror = reject
    w.postMessage({ fn: "toSnakeCase", args })
  })
}        
${exports.map((n) => `export const ${n} = proxy;`).join("\n")}        
`;
      }

      return undefined;
    },
  });
};
