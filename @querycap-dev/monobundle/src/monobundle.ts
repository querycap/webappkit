// @ts-ignore
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import del from "del";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { isEmpty, trim } from "@querycap/lodash";
import path, { join } from "path";
import { OutputOptions, rollup, RollupOptions } from "rollup";
import { babel as rollupBabel } from "@rollup/plugin-babel";
import dts from "rollup-plugin-dts";
import { execSync } from "child_process";
import { createAutoExternal } from "./autoExternal";
import transformRequireResolveWithImport from "./babel-plugin-transform-require-resolve-with-import/index";
import { createLogger } from "./log";
import { tscOnce } from "./tscOnce";

export const resolveRoot = (p: string): string => {
  const lernaJSONFile = join(p, "./lerna.json");
  const pnpmWorkspaceYAML = join(p, "./pnpm-workspace.yaml");

  if (!(existsSync(lernaJSONFile) || existsSync(pnpmWorkspaceYAML))) {
    return resolveRoot(join(p, "../"));
  }

  return p;
};

export interface IMonoBundleOption {
  cleanBeforeBundle: boolean;
  sideDependencies: string[];
  env: "browser" | "node";
}

const commonPeerDeps = {
  "@babel/runtime": "*",
  "@babel/runtime-corejs3": "*",
  "core-js": "*",
  "regenerator-runtime": "*",
};

export const monobundle = async ({ cwd = process.cwd(), dryRun }: { cwd?: string; dryRun?: boolean }) => {
  const monoRoot = resolveRoot(cwd);

  const indexTsFile = join(cwd, "index.ts");

  if (!existsSync(indexTsFile)) {
    return;
  }

  let pkg = JSON.parse(String(readFileSync(path.join(cwd, "package.json")))) as { [k: string]: any };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const options: IMonoBundleOption = {
    cleanBeforeBundle: true,
    ...(pkg.monobundle || {}),
  };

  delete pkg["ts"];
  delete pkg["type"];
  delete pkg["types"];
  delete pkg["main"];
  delete pkg["module"];

  pkg = {
    ...pkg,
    peerDependencies: {
      ...(pkg.peerDependencies as { [k: string]: any }),
      ...commonPeerDeps,
    },
  };

  const logger = createLogger(pkg.name);

  const autoExternal = createAutoExternal(monoRoot, pkg, logger, {
    commonPeerDeps: commonPeerDeps,
    sideDeps: options.sideDependencies,
  });

  const outputs = {
    files: ["dist/"],
    types: "./dist/index.d.ts",
    main: "./dist/index.cjs",
    module: "./dist/index.mjs",
  };

  const resolveRollupOptions: Array<() => Promise<RollupOptions>> = [
    () =>
      Promise.resolve({
        input: indexTsFile,
        output: [
          {
            dir: path.join(cwd, path.dirname(outputs.module)),
            format: "es",
            entryFileNames: "[name].mjs",
            chunkFileNames: "[name]-[hash].mjs",
          },
          {
            dir: path.join(cwd, path.dirname(outputs.main)),
            format: "cjs",
            entryFileNames: "[name].cjs",
            chunkFileNames: "[name]-[hash].cjs",
            exports: "named",
          },
        ],
        plugins: [
          autoExternal(),
          nodeResolve({
            extensions: [".ts", ".tsx", ".mjs", "", ".jsx"],
          }),
          json(),
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          rollupBabel({
            root: monoRoot,
            babelrc: true,
            plugins: [transformRequireResolveWithImport],
            babelHelpers: "runtime",
            envName: `rollup_${options.env}`.toUpperCase(),
            exclude: "node_modules/**",
            extensions: [".ts", ".tsx", ".mjs", "", ".jsx"],
          }),
        ],
      }),
    async () => {
      const index = await tscOnce(monoRoot, cwd);

      return {
        input: index,
        output: [
          {
            file: path.join(cwd, outputs.types),
            format: "es",
          },
        ],
        plugins: [
          autoExternal(false),
          dts({
            respectExternal: true,
          }),
        ],
      };
    },
  ];

  logger.warning("bundling");

  if (options.cleanBeforeBundle) {
    del.sync(outputs.files.concat("_cjs/", "_esm5/").map((dir) => path.join(cwd, dir)));
  }

  let finalFiles: string[] = [];

  for (const resolveRollupOption of resolveRollupOptions) {
    const rollupOption = await resolveRollupOption();

    const files = await rollup(rollupOption).then((bundle) => {
      return Promise.all(
        ([] as OutputOptions[]).concat(rollupOption.output!).map((output) => {
          if (dryRun) {
            return [];
          }

          return bundle.write(output).then((ret) => {
            if (output.dir) {
              return (ret.output || []).map((o) => path.join(path.relative(cwd, output.dir!), o.fileName));
            }
            return path.relative(cwd, output.file!);
          });
        }),
      );
    });

    finalFiles = finalFiles.concat(files.flat());
  }

  logger.success("bundled", ...finalFiles);

  const unused = autoExternal.warningAndGetUnused();

  for (const dep in unused.peerDeps) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    delete pkg.peerDependencies[dep];
  }

  for (const dep in unused.deps) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    delete pkg.dependencies[dep];
  }

  writeFileSync(
    path.join(cwd, "package.json"),
    `${JSON.stringify(
      {
        ...pkg,
        type: "module",
        types: outputs.types,
        main: outputs.main,
        module: outputs.module,
        exports: {
          ...(pkg.exports || {}),
          ".": {
            require: outputs.main,
            import: outputs.module,
          },
          // for index.ts
          "./index.ts": "./index.ts",
        },
        files: [
          ...((pkg.files as string[]) || []).filter(
            (f: string) => !outputs.files.concat("dist/", "_cjs/", "_esm5/").includes(f),
          ),
          ...outputs.files,
        ],
        dependencies: isEmpty(pkg.dependencies) ? undefined : (pkg.dependencies as { [k: string]: string }),
        peerDependencies: isEmpty(pkg.peerDependencies) ? undefined : (pkg.peerDependencies as { [k: string]: string }),
        scripts: {
          ...(pkg.scripts as { [k: string]: string }),
          prepublishOnly: "../../node_modules/.bin/monobundle",
        },
        repository: pkg.repository
          ? pkg.repository
          : {
              type: "git",
              url: `ssh://${trim(String(execSync("git remote get-url origin")), "\n")}`,
            },
      },
      null,
      2,
    )}
`, // for prettier
  );
};
