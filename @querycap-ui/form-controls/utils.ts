import { roundedEm, select, theme } from "@querycap-ui/core/macro";

export const fitPaddingY = (small?: boolean) => roundedEm(small ? 0.3 : 0.6);

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
