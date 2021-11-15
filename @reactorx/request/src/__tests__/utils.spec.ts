import { paramsSerializer } from "../utils";

describe("#paramsSerializer", () => {
  it("should stringify params correctly", () => {
    const p = paramsSerializer({
      s: "s",
      int: [1, 2],
      o: { a: "1" },
      x: undefined,
    });
    expect(p).toBe("s=s&int=1&int=2&o=%7B%22a%22%3A%221%22%7D");
  });
});
