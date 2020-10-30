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
          file: "/ci/webapp2.gitlab-ci.yml",
        },
      ],
    }),
  );
};
