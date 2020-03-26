/**
 * @jest-environment node
 */

import { Suite } from "benchmark";
import { cover } from "polished";
import { select } from "@querycap-ui/core/select";
import { defaultTheme, theme } from "../theme";

describe("selector", () => {
  it.skip("benchmark", (done) => {
    jest.setTimeout(100000);

    const suite = new Suite();

    // 添加测试
    suite
      .add("selector", () => {
        const applyTheme = select().display("flex").flexDirection("row").alignItems("center").paddingX(theme.space.s2);

        applyTheme(defaultTheme);
      })
      .add("selector with object", () => {
        const applyTheme = select().with((t) => ({
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          paddingLeft: t.space.s2,
          paddingRight: t.space.s2,
        }));

        applyTheme(defaultTheme);
      })
      .add("object", () => {
        const applyTheme = (t: any) => ({
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          paddingLeft: t.space.s2,
          paddingRight: t.space.s2,
        });

        applyTheme(defaultTheme);
      })
      .on("cycle", (evt: any) => {
        console.log(String(evt.target));
      })
      .on("complete", () => {
        done();
      })
      .run({ async: true });
  });

  it("selector", () => {
    const applyTheme = select().with(cover()).display("flex").flexDirection("row").alignItems("center").paddingX(10);

    for (let i = 0; i < 10; i++) {
      applyTheme(defaultTheme);
    }

    expect(applyTheme(defaultTheme)).toEqual([
      { bottom: 0, left: 0, position: "absolute", right: 0, top: 0 },
      { alignItems: "center", display: "flex", flexDirection: "row", paddingLeft: 10, paddingRight: 10 },
    ]);
  });

  it("immutable", () => {
    const flex = select().display("flex");
    const flexWithFontSize = flex.fontSize(12);

    expect(flex(defaultTheme)).toEqual({ display: "flex" });
    expect(flexWithFontSize(defaultTheme)).toEqual({ display: "flex", fontSize: 12 });
  });

  it("with sub", () => {
    const applyTheme = select()
      .backgroundColor("black")
      .with(false)
      .with(select("& a").backgroundColor("red").with(select("&[data-current=true]").backgroundColor("red")));

    for (let i = 0; i < 10; i++) {
      applyTheme(defaultTheme);
    }

    expect(applyTheme(defaultTheme)).toEqual([
      { backgroundColor: "black" },
      false,
      {
        "& a": [{ backgroundColor: "red" }, { "&[data-current=true]": { backgroundColor: "red" } }],
      },
    ]);
  });
});
