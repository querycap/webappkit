import { fromWorker } from "@querycap/webworkerutils";

const concat = fromWorker(() => import("./workers/concat.worker"));

describe("worker", () => {
  it("worker should work", async () => {
    const ret = await concat({ values: ["1", "2"] });

    expect(ret).toBe("1.2");
  });
});
