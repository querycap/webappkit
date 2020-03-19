import { cover } from "polished";
import { selector } from "../selector";
import { theme } from "../theme";

describe("selector", () => {
  it("selector", () => {
    const applyTheme = selector()
      .with(cover())
      .display("flex")
      .flexDirection("row")
      .alignItems("center");

    expect(applyTheme(theme)).toEqual([
      { bottom: 0, left: 0, position: "absolute", right: 0, top: 0 },
      { alignItems: "center", display: "flex", flexDirection: "row" },
    ]);
  });

  it("sub selector", () => {
    const applyTheme = selector()
      .backgroundColor("black")
      .with(false)
      .with(selector("&:active", "&:hover").backgroundColor("red"))
      .with(selector("&[data-current=true]").backgroundColor("red"));

    expect(applyTheme(theme)).toEqual([
      { backgroundColor: "black" },
      false,
      {
        "&:active": { backgroundColor: "red" },
        "&:hover": { backgroundColor: "red" },
      },
      {
        "&[data-current=true]": { backgroundColor: "red" },
      },
    ]);
  });
});
