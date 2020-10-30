import { IState } from "./state";
import { exec } from "./exec";

export const fromCommitRefName = (commitTag = "") => {
  const rule = commitTag.replace(/^feat(ure)?\//, "");

  const [appAndFeature, env] = rule.split(".");
  const [name, feature] = appAndFeature.split("--", 2);

  return {
    name,
    feature,
    env,
  };
};

export const toCommitRefName = (state: IState) =>
  `workspace/${state.name}` +
  `${state.feature ? `/feat/${state.feature}` : ""}` +
  `${state.env && state.env !== "default" && state.env !== "staging" ? `.${state.env}` : ""}`;

export const release = (state: IState) => {
  const tag = toCommitRefName(state)
  exec(`git tag --force --annotate ${tag} --message "${tag}"`, state);
  exec(`git push --no-verify origin :refs/tags/${tag}`, state);
  exec(`git push --follow-tags`, state);
};
