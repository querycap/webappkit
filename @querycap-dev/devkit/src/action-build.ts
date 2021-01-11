import { generate } from "@querycap-dev/generate";
import { dump } from "js-yaml";
import { isUndefined, omitBy } from "lodash";
import { join } from "path";
import { stringify } from "querystring";
import { IState } from "./state";

const omitEmpty = <T extends object = any>(o: T) => omitBy(o, (v) => isUndefined(v));

export const writeConfig = (cwd: string, state: IState) => {
  const baseConfig = {
    APP: state.name,
    ENV: state.env,

    // for overwrite
    PROJECT_NAME: `web-${state.name}`,
    PROJECT_GROUP: state.project.group,
    PROJECT_DESCRIPTION: state.meta.manifest?.name,
  };

  generate(
    join(cwd, `./config/default.yml`),
    dump(
      omitEmpty({
        ...baseConfig,
        APP_CONFIG: stringify(state.meta.config || {}, ",", "=", {
          encodeURIComponent: (v) => v,
        }),
      }),
    ),
  );

  generate(
    join(cwd, `./config/master.yml`),
    dump(
      omitEmpty({
        APP_CONFIG: stringify(state.meta.config$ || {}, ",", "=", {
          encodeURIComponent: (v) => v,
        }),
      }),
    ),
  );

  generate(
    join(cwd, `./deploy/qservice.yml`),
    `apiVersion: serving.octohelm.tech/v1alpha1
kind: QService
spec:
  image: \${{ PROJECT_IMAGE }}
  envs:
    APP: \${{ APP }}
    ENV: \${{ ENV }}
    APP_CONFIG: \${{ APP_CONFIG }}
  ports:
    - "80"
  livenessProbe:
    action: "http://:80/"
    initialDelaySeconds: 5
    periodSeconds: 5
  readinessProbe:
    action: "http://:80/"
    initialDelaySeconds: 5
    periodSeconds: 5
`,
  );

  generate(
    join(cwd, `./Dockerfile`),
    `
ARG DOCKER_REGISTRY
FROM --platform=\${BUILDPLATFORM} \${DOCKER_REGISTRY}/docker.io/library/node:15-buster as build-env

FROM --platform=\${BUILDPLATFORM} build-env AS builder

WORKDIR /src
COPY ./ ./

ARG YARN_NPM_REGISTRY_SERVER
ARG YARN_HTTPS_PROXY
ENV YARN_CACHE_FO:LDER=/tmp/yarn-cache
RUN yarn

ARG APP
ARG ENV
ARG PROJECT_GROUP
ARG PROJECT_VERSION
RUN PROJECT_GROUP=\${PROJECT_GROUP} PROJECT_VERSION=\${PROJECT_VERSION} yarn devkit build --prod \${APP} \${ENV}

FROM \${DOCKER_REGISTRY}/docker.io/querycap/webappserve:0.0.0

ARG PROJECT_NAME
COPY --from=builder /src/public/\${PROJECT_NAME} /app
`,
  );
};
