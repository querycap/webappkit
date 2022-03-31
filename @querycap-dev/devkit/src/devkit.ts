import { has, isFunction, isObject, keys, mapKeys, mapValues, startsWith } from "@querycap/lodash";
import { join } from "path";
import { writeConfig } from "./action-build";
import { initial } from "./action-initial";
import { release } from "./action-release";
import { exec } from "./exec";
import { IState, IDevkitConfig } from "./state";
import * as vm from "vm";
import { createContext } from "vm";
import { existsSync } from "fs";
import { readdir, lstat, readFile } from "fs/promises";
import { build } from "esbuild";

const resolveApps = async (cwd: string): Promise<{ [key: string]: string }> => {
  const appBases: { [key: string]: string } = {};

  const root = join(cwd, "src-app");

  const paths = existsSync(root) ? await readdir(root) : [];

  for (const p of paths) {
    const fullPath = join(root, p);

    if ((await lstat(fullPath)).isDirectory()) {
      appBases[p] = fullPath;
    }
  }

  return appBases;
};

type TValueBuilder = (env: string, feature: string, nameOrHolder: string) => string;

const loadConfigFromFile = async (cwd: string, state: IState) => {
  state.context = join(cwd, "src-app", state.name);

  const configFile = join(state.context, "config.ts");

  if (!existsSync(configFile)) {
    return;
  }

  const ret = await build({
    entryPoints: [configFile],
    outfile: "config.json",
    format: "cjs",
    sourcemap: false,
    bundle: true,
    splitting: false,
    globalName: "conf",
    write: false,
  });

  const ctx = {
    module: {
      exports: {},
    },
  };

  vm.runInContext(String(ret.outputFiles[0].text), createContext(ctx));

  const conf = ctx.module.exports as any;

  const envs = mapKeys(conf.ENVS, (key: string) => key.toLowerCase());

  if (conf.GROUP) {
    state.project.group = conf.GROUP;
  }

  const envKeys = keys(envs);

  if (envKeys.length > 0 && (state.env === "" || !envs[state.env])) {
    console.warn(`[warning] missing env, use ${envKeys[0]} as default, or use one of ${envKeys.join(", ")}`);
    state.env = envKeys[0];
  }

  state.meta = {};

  for (const key in conf) {
    if (has(conf, key) && startsWith(key, "APP_")) {
      const metaKey = key.slice(4).toLowerCase();

      state.meta[metaKey] = mapValues(conf[key], (fnOrValue: TValueBuilder) =>
        isFunction(fnOrValue) ? fnOrValue(state.env, state.feature || "", state.name) : fnOrValue,
      ) as any;

      if (metaKey === "config") {
        state.meta[`config$`] = mapValues(conf[key], (fnOrValue: TValueBuilder, k) => {
          const v = isFunction(fnOrValue) ? fnOrValue("$", state.feature || "", state.name) : fnOrValue;
          if (v[0] !== "$" && k.startsWith("SRV_")) {
            return `$\{{ endpoints.api.${k.slice(4).replace(/_/g, "-").toLowerCase()}.endpoint }}`;
          }
          return v;
        }) as any;
      }
    }
  }
};

export const devkit = async (cwd = process.cwd()) => {
  let c: IDevkitConfig = {
    images: {
      build: "docker.io/library/node:16-buster",
      runtime: "docker.io/querycap/webappserve:0.2.1",
    },
    actions: {
      dev: "echo 'dev'",
      build: "echo 'build'",
      release: "",
    },
  };

  const pkgJSON = join(cwd, "package.json");

  if (existsSync(pkgJSON)) {
    try {
      const pkg = JSON.parse(String(await readFile(pkgJSON)));

      if (pkg && isObject(pkg.devkit)) {
        const devkitConfig = pkg.devkit.actions || pkg.devkit.images ? pkg.devkit : { actions: pkg.devkit };

        c = {
          images: {
            ...c.images,
            ...(devkitConfig.images || {}),
          },
          actions: {
            ...c.actions,
            ...(devkitConfig.actions || {}),
          },
        };
      }
    } catch (e) {
      //
    }
  }

  const appBases = await resolveApps(cwd);

  return {
    apps: keys(appBases),
    actions: c.actions,
    run: async (
      action: string,
      app: string,
      env: string,
      opts: {
        production?: boolean;
        debug?: boolean;
        dryRun?: boolean;
        projectGroup?: string;
        projectVersion?: string;
      },
    ) => {
      if (action === "init") {
        initial(cwd);
        return;
      }

      if (!has(c.actions, action || "")) {
        throw new Error(`missing action ${keys(c.actions).join(", ")}`);
      }

      const [name, feature] = (app || "").toLowerCase().split("--");

      const state: IState = {
        cwd,
        context: "",

        name,
        feature: feature || "",
        env,
        project: {
          group: opts.projectGroup,
          version: opts.projectVersion,
        },
        flags: {
          production: opts.production,
          debug: opts.debug,
          dryRun: opts.dryRun,
        },
        meta: {},
      };

      if (!appBases[state.name]) {
        throw new Error(`missing <app>, should one of ${keys(appBases).join(", ")}`);
      }

      await loadConfigFromFile(cwd, state);

      if (action === "release") {
        release(state);
        return;
      }

      if (action === "dev") {
        writeConfig(join(cwd, "cmd", state.name), state, c);
      }

      exec(c.actions[action], state);
    },
  };
};
