import { generate } from "@querycap-dev/generate";
import { safeDump } from "js-yaml";
import { isUndefined, omitBy } from "lodash";
import { join } from "path";
import { stringify } from "querystring";
import { IState } from "./state";

const omitEmpty = <T extends object = any>(o: T) => omitBy(o, (v) => isUndefined(v));

const toApp = (state: IState) =>
  `${state.name}` +
  `${state.feature ? `--${state.feature}` : ""}` +
  `${state.project.group ? `__${state.project.group}` : ""}` +
  `${state.env && state.env !== "default" && state.env !== "demo" ? `--${state.env}` : ""}`;

export const writeConfig = (cwd: string, state: IState, filename = "default.yml") => {
  generate(
    join(cwd, `./config/${filename}`),
    safeDump(
      omitEmpty({
        APP: toApp(state),
        ENV: state.env,

        APP_CONFIG: stringify(state.meta.config || {}, ",", "=", {
          encodeURIComponent: (v) => v,
        }),

        // for overwrite
        PROJECT_NAME: `web-${state.name}`,
        PROJECT_GROUP: state.project.group,
        PROJECT_FEATURE: state.feature || "",
        PROJECT_DESCRIPTION: state.meta.manifest?.name,
      }),
    ),
  );
};
