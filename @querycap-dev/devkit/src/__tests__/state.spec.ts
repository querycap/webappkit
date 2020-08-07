import { envValueFromState, IState, stateFromEnvValue } from "../state";

describe("#state", () => {
  it("#envValueFromState", () => {
    const state: IState = {
      cwd: "",
      context: "",
      name: "name",
      feature: "",
      env: "env",
      project: {},
      flags: {},
      meta: {},
    };

    console.log(stateFromEnvValue(envValueFromState(state)));
  });
});
