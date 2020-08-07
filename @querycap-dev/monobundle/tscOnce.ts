import { spawnSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path, { join } from "path";

const sleep = (time: number) =>
  new Promise((resolve) => {
    setTimeout(() => resolve(), time);
  });

const runTscOnce = async (projectRoot: string, lockfile: string, tmpDir: string): Promise<any> => {
  if (!existsSync(tmpDir) || !existsSync(lockfile)) {
    mkdirSync(tmpDir, { recursive: true });
    writeFileSync(lockfile, "running");

    console.log(`typescript compiling ....`);

    const output = spawnSync("tsc", ["--diagnostics", "--emitDeclarationOnly", "--rootDir", ".", "--outDir", ".tmp"], {
      cwd: projectRoot,
    }).stdout;

    console.log(String(output));

    writeFileSync(lockfile, "done");

    return Promise.resolve();
  }

  if (existsSync(lockfile) && String(readFileSync(lockfile)) !== "done") {
    await sleep(100);

    return runTscOnce(projectRoot, lockfile, tmpDir);
  }

  return Promise.resolve();
};

export const tscOnce = async (monoRoot: string, cwd: string) => {
  const monoPkg = path.relative(monoRoot, cwd);

  const cacheBasic = join(monoRoot, "node_modules", ".cache", "monobundle");

  if (!existsSync(cacheBasic)) {
    mkdirSync(cacheBasic, { recursive: true });
  }

  const lastCommit = String(
    spawnSync("git", ["show-ref", "--head", "HEAD"], {
      cwd: monoRoot,
    }).stdout,
  ).split(" ")[0];

  const lockfile = join(cacheBasic, `tsc-${lastCommit}.log`);
  const tmpRoot = join(monoRoot, ".tmp");

  await runTscOnce(monoRoot, lockfile, tmpRoot);

  return path.join(monoRoot, ".tmp", monoPkg, "index.d.ts");
};
