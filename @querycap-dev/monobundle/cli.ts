import yargs from "yargs";
import { monobundle } from "./monobundle";

export const cli = () => {
  const opt = yargs.option("dryRun", {
    alias: "dry-run",
    type: "boolean",
  }).argv;

  void monobundle(opt);
};
