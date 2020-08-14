import { parseSearchString, toSearchString } from "../helpers";

describe("helpers", () => {
  it("toSearchString && parseSearchString", () => {
    const query = {
      some: 1,
      string: "s",
      slice: [1, 2],
    };

    const search = toSearchString(query);

    expect(search).toBe("?some=1&string=s&slice=1&slice=2");
    expect(parseSearchString(search)).toEqual({
      some: "1",
      string: "s",
      slice: ["1", "2"],
    });
  });
});
