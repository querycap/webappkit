import path, { dirname } from "path";
import yargs from "yargs";
import { cliFor } from "../";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const cwd = path.join(__dirname, "../__examples__");

const cmd = (...args: string[]) => cliFor(yargs(args, cwd), cwd)();

describe("#devkit", () => {
  it.skip("--help", async () => {
    await cmd("--help");
  });

  it("init", async () => {
    await cmd("init");
  });

  it("dev", async () => {
    await cmd("dev", "demo--test", "--dry-run");
  });

  it("build", async () => {
    await cmd("build", "demo--test", "demo", "--prod", "--debug", "--dry-run");
  });

  it("release", async () => {
    await cmd("release", "demo", "demo", "--dry-run");
  });
});
