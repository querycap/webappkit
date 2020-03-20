/**
 * @jest-environment node
 */

import { Suite } from "benchmark";
import { cover } from "polished";
import { selector } from "../selector";
import { theme, themes } from "../theme";

describe("selector", () => {
  it.skip("benchmark", (done) => {
    jest.setTimeout(100000);

    const suite = new Suite();

    // 添加测试
    suite
      .add("selector", () => {
        const applyTheme = selector()
          .display("flex")
          .flexDirection("row")
          .alignItems("center")
          .paddingX(themes.space.s2);

        applyTheme(theme);
      })
      .add("selector with object", () => {
        const applyTheme = selector().with((t) => ({
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          paddingLeft: t.space.s2,
          paddingRight: t.space.s2,
        }));

        applyTheme(theme);
      })
      .add("object", () => {
        const applyTheme = (t: any) => ({
          display: "flex",
          alignItems: "center",
          flexDirection: "row",
          paddingLeft: t.space.s2,
          paddingRight: t.space.s2,
        });

        applyTheme(theme);
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
    const applyTheme = selector()
      .with(cover())
      .display("flex")
      .flexDirection("row")
      .alignItems("center")
      .paddingX(10);

    for (let i = 0; i < 10; i++) {
      applyTheme(theme);
    }

    expect(applyTheme(theme)).toEqual([
      { bottom: 0, left: 0, position: "absolute", right: 0, top: 0 },
      { alignItems: "center", display: "flex", flexDirection: "row", paddingLeft: 10, paddingRight: 10 },
    ]);
  });

  it("immutable", () => {
    const flex = selector().display("flex");
    const flexWithFontSize = flex.fontSize(12);

    expect(flex(theme)).toEqual({ display: "flex" });
    expect(flexWithFontSize(theme)).toEqual({ display: "flex", fontSize: 12 });
  });

  it("with sub", () => {
    const applyTheme = selector()
      .backgroundColor("black")
      .with(false)
      .with(
        selector("& a")
          .backgroundColor("red")
          .with(selector("&[data-current=true]").backgroundColor("red")),
      );

    for (let i = 0; i < 10; i++) {
      applyTheme(theme);
    }

    expect(applyTheme(theme)).toEqual([
      { backgroundColor: "black" },
      false,
      {
        "& a": [{ backgroundColor: "red" }, { "&[data-current=true]": { backgroundColor: "red" } }],
      },
    ]);
  });
});
