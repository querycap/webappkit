import { parse, stringify } from "../configvalue";

describe("parse", () => {
  it("parse", () => {
    const c = parse("KEY1=111,KEY2=YTExMSw=");

    expect(c).toEqual({
      KEY1: "111",
      KEY2: "a111,",
    });
  });

  it("stringify", () => {
    expect(
      stringify({
        KEY1: "111",
        KEY2: "a111,",
      }),
    ).toEqual("KEY1=111,KEY2=YTExMSw=");
  });
});
