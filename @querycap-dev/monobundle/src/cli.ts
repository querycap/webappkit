import yargs from "yargs";
import { monobundle } from "./monobundle";

export const cli = async () => {
  const opt = await yargs(process.argv.slice(2)).option("dryRun", {
    alias: "dry-run",
    type: "boolean",
  }).argv;

  return monobundle({
    ...opt,
    ...(opt._.length > 0 ? { cwd: opt._[0] } : {}),
  } as any);
};
