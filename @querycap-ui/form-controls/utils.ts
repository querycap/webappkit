import { select, theme } from "@querycap-ui/core/macro";

export const base = select()
  .lineHeight(theme.lineHeights.normal)
  .borderWidth(1)
  .borderStyle("solid")
  .boxSizing("border-box")
  .fontSize(theme.state.fontSize)
  .fontFamily("inherit")
  .verticalAlign("baseline")
  .borderRadius(theme.radii.s)
  .appearance("none")
  .textDecoration("none");
