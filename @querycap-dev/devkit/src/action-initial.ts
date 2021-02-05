import { generate } from "@querycap-dev/generate";
import { dump } from "js-yaml";
import { join } from "path";

export const initial = (cwd: string) => {
  generate(
    join(cwd, ".gitlab-ci.yml"),
    dump({
      include: [
        {
          project: "infra/hx",
          file: "/ci/webapp2.gitlab-ci.yml",
        },
      ],
    }),
  );
};
