import path from "path";
import yargs from "yargs";
import { cliFor } from "../index";

const cwd = path.join(__dirname, "../__examples__");

const cmd = (...args: string[]) => {
  cliFor(yargs(args, cwd), cwd)();
};

describe("#devkit", () => {
  it.skip("--help", () => {
    cmd("--help");
  });

  it("init", () => {
    cmd("init");
  });

  it("release", function () {
    cmd("release", "demo", "demo", "--dry-run");
  });

  it("dev", function () {
    cmd("dev", "demo--test", "--dry-run");
  });

  it("build", function () {
    cmd("build", "demo--test", "--prod", "--debug", "--dry-run");
  });
});
