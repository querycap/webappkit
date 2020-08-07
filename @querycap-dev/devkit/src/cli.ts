import { take } from "lodash";
import yargs, { Argv } from "yargs";
import { devkit } from "./devkit";

export const cliFor = <T>(argv: Argv<T>, cwd = process.cwd()) => {
  return () => {
    const kit = devkit(cwd);

    let y = argv
      .usage("Usage: $0 <action> <app> [env] [options]")
      .version()
      .help()
      .option("production", {
        alias: "prod",
        type: "boolean",
        desc: "production",
      })
      .option("dryRun", {
        alias: "dry-run",
        type: "boolean",
        desc: "dry run",
      })
      .option("debug", {
        type: "boolean",
        desc: "debug mode",
      })
      .option("project-group", {
        type: "string",
        default: process.env.PROJECT_GROUP,
        desc: "project group",
      })
      .option("project-version", {
        type: "string",
        default: process.env.PROJECT_VERSION,
        desc: "project version",
      });

    for (const k in kit.actions) {
      y = y.command(k, "", (argv) => argv.usage(`Usage: $0 ${k} <app> [env] [options]`));
    }

    y = y.command("init", "initial project");

    try {
      const commands = take(y.argv._, 3);

      kit.run(commands[0], commands[1] || process.env.APP || "", commands[2] || process.env.ENV || "", y.argv);
    } catch (e) {
      console.error(e);
      y.showHelp();
    }
  };
};

export const cli = cliFor(yargs);
