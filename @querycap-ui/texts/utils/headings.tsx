import { select, theme, roundedEm } from "@querycap-ui/core/macro";

export const headings = {
  break: select()
    .paddingBottom(roundedEm(0.3))
    .borderWidth(1)
    .borderStyle("solid")
    .borderColor(theme.state.borderColor),

  h1: select()
    .marginTop(roundedEm(1.2))
    .marginBottom(roundedEm(0.9))
    .fontSize(theme.fontSizes.xl)
    .fontWeight(theme.fontWeights.bold),

  h2: select()
    .marginTop(roundedEm(1.2))
    .marginBottom(roundedEm(0.8))
    .fontSize(theme.fontSizes.l)
    .fontWeight(theme.fontWeights.bold),

  h3: select()
    .marginTop(roundedEm(1.2))
    .marginBottom(roundedEm(0.8))
    .fontWeight(theme.fontWeights.bold)
    .fontSize(theme.fontSizes.m),

  h4: select()
    .marginTop(roundedEm(1.2))
    .marginBottom(roundedEm(0.8))
    .fontWeight(theme.fontWeights.bold)
    .fontSize(theme.fontSizes.normal),

  h5: select()
    .marginTop(roundedEm(1.2))
    .marginBottom(roundedEm(0.8))
    .fontWeight(theme.fontWeights.bold)
    .fontSize(theme.fontSizes.s),

  h6: select()
    .marginTop(roundedEm(1.2))
    .marginBottom(roundedEm(0.8))
    .fontWeight(theme.fontWeights.bold)
    .fontSize(theme.fontSizes.xs),
};
