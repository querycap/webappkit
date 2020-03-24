import { selector, themes } from "@querycap-ui/core";

export const base = selector()
  .lineHeight(themes.lineHeights.normal)
  .borderWidth(1)
  .borderStyle("solid")
  .boxSizing("border-box")
  .fontSize(themes.state.fontSize)
  .fontFamily("inherit")
  .verticalAlign("baseline")
  .borderRadius(themes.radii.s)
  .appearance("none")
  .textDecoration("none");
