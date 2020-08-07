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
  `feat/${state.name}` +
  `${state.feature ? `--${state.feature}` : ""}` +
  `${state.env && state.env !== "default" && state.env !== "staging" ? `.${state.env}` : ""}`;

export const release = (state: IState) => {
  exec(`git tag -f ${toCommitRefName(state)}`, state);
  exec(`git push -f origin refs/tags/${toCommitRefName(state)}`, state);
};
