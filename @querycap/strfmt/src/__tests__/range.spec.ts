import { IRange, parseRange, stringifyRange } from "../range";

describe("range", () => {
  it("parseRange & stringifyRange", () => {
    const r = parseRange("2019-12-04T00:00:00+08:00<..<2019-12-05T00:00:00+08:00");

    expect(r).toEqual({
      from: "2019-12-04T00:00:00+08:00",
      exclusiveFrom: true,
      to: "2019-12-05T00:00:00+08:00",
      exclusiveTo: true,
      exactly: false,
    } as IRange);

    expect(stringifyRange(r)).toEqual("2019-12-04T00:00:00+08:00<..<2019-12-05T00:00:00+08:00");
  });

  it("exactly value", () => {
    const r = parseRange("2019-12-04T00:00:00+08:00");

    expect(r).toEqual({
      from: "2019-12-04T00:00:00+08:00",
      exactly: true,
    } as IRange);

    expect(stringifyRange(r)).toEqual("2019-12-04T00:00:00+08:00");
  });

  it("from value", () => {
    const r = parseRange("2019-12-04T00:00:00+08:00..");

    expect(r).toEqual({
      from: "2019-12-04T00:00:00+08:00",
      to: "",
      exactly: false,
    } as IRange);

    expect(stringifyRange(r)).toEqual("2019-12-04T00:00:00+08:00..");
  });
});
