import { monobundle } from "@querycap-dev/monobundle";
import del from "del";
import path from "path";

describe("monobundle", () => {
  beforeEach(() => {
    del.sync(path.join(__dirname, "../dist/"));
  });

  jest.setTimeout(100000);

  it("run", async () => {
    await Promise.all([
      monobundle({
        cwd: path.join(__dirname, "../../monobundle"),
      }),
      monobundle({
        cwd: path.join(__dirname, "../../webpack-preset-ts"),
      }),
    ]);
  });
});
