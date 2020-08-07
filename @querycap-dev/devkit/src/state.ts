export interface IState {
  cwd: string;
  context: string;

  name: string;
  env: string;
  feature?: string;

  project: {
    version?: string;
    group?: string;
  };

  flags: {
    production?: boolean;
    debug?: boolean;
    dryRun?: boolean;
  };

  meta: { [key: string]: { [k: string]: any } };
}

export const envValueFromState = (state: IState) => Buffer.from(JSON.stringify(state)).toString("base64");

export const stateFromEnvValue = (envValue: string): IState =>
  JSON.parse(Buffer.from(envValue, "base64").toString("utf8")) as IState;
