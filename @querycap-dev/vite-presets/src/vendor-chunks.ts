import type { GetManualChunkApi, Plugin } from "rollup";
import { uniq } from "lodash";

export type ChunksGroups = { [name: string]: RegExp };

/**
 * split vendor to multiple vendor files vendor~[name].[hash].js
 */
export const vendorChunks = (vendorGroups: ChunksGroups = {}): Plugin => {
  const cache = new Map();

  const vendorPkgName = (id: string) => {
    const parts = id.split("/node_modules/");
    if (parts.length === 1) {
      return "";
    }

    const dirPaths = parts[parts.length - 1].split("/");

    if (dirPaths[0][0] == "@") {
      return `${dirPaths[0]}/${dirPaths[1]}`;
    }

    return dirPaths[0];
  };

  const projectDirectUse: { [k: string]: boolean } = {};
  let usedBy: { [k: string]: string[] };

  const splitVendorChunk = (id: string, { getModuleInfo, getModuleIds }: GetManualChunkApi): string => {
    if (!usedBy) {
      usedBy = {};

      [...getModuleIds()].forEach((k) => {
        const pkgName = vendorPkgName(k);

        if (pkgName) {
          const m = getModuleInfo(k)!;

          [...m.importedIds, ...m.dynamicallyImportedIds]
            .map((p) => vendorPkgName(p))
            .filter((v) => v && v != pkgName)
            .forEach((dep) => {
              usedBy[dep] = uniq([...(usedBy[dep] || ([] as string[])), pkgName]);
            });

          return;
        }

        getModuleInfo(k)
          ?.importedIds.map((p) => vendorPkgName(p))
          .filter((v) => v && v != pkgName)
          .forEach((p) => {
            projectDirectUse[p] = true;
          });
      });
    }

    if (cache.has(id)) {
      return cache.get(id);
    }

    let pkgName = vendorPkgName(id);

    while (!projectDirectUse[pkgName]) {
      if (usedBy[pkgName] && usedBy[pkgName].length > 0) {
        pkgName = usedBy[pkgName][0];
      } else {
        break;
      }
    }

    for (const groupKey in vendorGroups) {
      if (vendorGroups[groupKey].test(pkgName)) {
        pkgName = groupKey;
        break;
      }
    }

    const name = `vendor~${pkgName.replace("/", "--")}`;

    cache.set(id, name);

    return name;
  };

  return {
    name: "vite-presets/vendor-chunks",

    outputOptions(o) {
      o.manualChunks = (id, api) => {
        if (id.includes("node_modules")) {
          return splitVendorChunk(id, api);
        }
        return undefined;
      };
      return o;
    },
  };
};
