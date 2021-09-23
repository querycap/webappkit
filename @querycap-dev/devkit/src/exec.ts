import spawn from "cross-spawn";
// @ts-ignore
import npmPath from "npm-path";
import { envValueFromState, IState } from "./state";

export const exec = (sh: string, state: IState) => {
  if (state.flags.dryRun) {
    console.log(">", sh);
    return;
  }

  const cmd = spawn(sh, {
    stdio: "inherit",
    shell: true,
    detached: false,
    env: {
      ...process.env,
      [npmPath.PATH]: npmPath.getSync(),
      DEVKIT: envValueFromState(state),
    },
  });

  cmd.on("close", (code) => {
    if (code !== 0) {
      code && process.exit(code);
    }
  });

  process.on("SIGINT", () => {
    cmd.kill("SIGINT");
  });

  process.on("SIGTERM", () => {
    cmd.kill("SIGTERM");
  });

  process.on("exit", () => {
    cmd.kill();
  });
};
