import { cover } from "polished";
import { applyStyles, selector } from "../selector";
import { theme } from "../theme";

describe("flex", () => {
  it("selector", () => {
    const applyTheme = applyStyles(
      cover(),
      selector()
        .display("flex")
        .flexDirection("row")
        .alignItems("center"),
    );

    expect(applyTheme(theme)).toEqual([
      { bottom: 0, left: 0, position: "absolute", right: 0, top: 0 },
      { alignItems: "center", display: "flex", flexDirection: "row" },
    ]);
  });

  it("sub selector", () => {
    const applyTheme = selector("&:active", "&:hover").backgroundColor("red");

    expect(applyTheme(theme)).toEqual({
      "&:active": { backgroundColor: "red" },
      "&:hover": { backgroundColor: "red" },
    });
  });
});
