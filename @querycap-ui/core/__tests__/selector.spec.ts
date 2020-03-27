/**
 * @jest-environment node
 */
import { select } from "@querycap-ui/core";
import { cover } from "polished";
import { defaultTheme } from "../theme";

describe("select", () => {
  it("simple", () => {
    const applyTheme = select().with(cover()).display("flex").flexDirection("row").alignItems("center").paddingX(10);

    for (let i = 0; i < 10; i++) {
      applyTheme(defaultTheme);
    }

    expect(applyTheme(defaultTheme)).toEqual([
      { bottom: 0, left: 0, position: "absolute", right: 0, top: 0 },
      { alignItems: "center", display: "flex", flexDirection: "row", paddingLeft: 10, paddingRight: 10 },
    ]);
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
