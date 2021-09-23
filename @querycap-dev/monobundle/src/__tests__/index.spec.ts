import { monobundle } from "../monobundle";
import del from "del";
import { join } from "path";

// @ts-ignore
import { jest } from "@jest/globals";

describe("monobundle", () => {
  beforeEach(() => {
    del.sync(join(__dirname, "../dist/"));
  });

  jest.setTimeout(100000);

  it("install", async () => {
    await Promise.all([
      monobundle({
        cwd: join(__dirname, "../../monobundle"),
      }),
    ]);
  });

  it("run", async () => {
    await monobundle({
      cwd: join(__dirname, "../../monobundle"),
    });
  });
});
