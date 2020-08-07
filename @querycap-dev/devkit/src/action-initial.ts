import { generate } from "@querycap-dev/generate";
import { safeDump } from "js-yaml";
import { join } from "path";

export const initial = (cwd: string) => {
  generate(
    join(cwd, ".gitlab-ci.yml"),
    safeDump({
      include: [
        {
          project: "infra/hx",
          file: "/ci/webapp.gitlab-ci.yml",
        },
      ],
    }),
  );

  generate(
    join(cwd, "dockerfile.default.yml"),
    safeDump({
      from: "querycap/webappserve:latest",
      env: {
        APP_CONFIG: "${APP_CONFIG}",
        ENV: "${ENV}",
      },
      add: {
        "./public/${PROJECT_NAME}": "/app",
      },
    }),
  );

  generate(
    join(cwd, "helmx.default.yml"),
    safeDump({
      service: {
        ports: ["80:80"],
        readinessProbe: {
          action: "http://:80/",
          initialDelaySeconds: 5,
          periodSeconds: 5,
        },
        livenessProbe: {
          action: "http://:80/",
          initialDelaySeconds: 5,
          periodSeconds: 5,
        },
      },
    }),
  );

  generate(
    join(cwd, "helmx.project.yml"),
    safeDump({
      project: {
        version: "0.0.0",
        name: "${PROJECT_NAME}",
        feature: "${PROJECT_FEATURE}",
        group: "${PROJECT_GROUP}",
        description: "${PROJECT_DESCRIPTION}",
      },
    }),
  );
};
