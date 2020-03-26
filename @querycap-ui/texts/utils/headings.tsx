import { select, theme } from "@querycap-ui/core/macro";

export const headings = {
  break: select()
    .paddingBottom(theme.space.s1)
    .borderWidth(1)
    .borderStyle("solid")
    .borderColor(theme.state.borderColor),

  h1: select()
    .marginTop(theme.space.s4)
    .marginBottom(theme.space.s3)
    .fontSize(theme.fontSizes.xl)
    .fontWeight(theme.fontWeights.bold),

  h2: select()
    .marginTop(theme.space.s4)
    .marginBottom(theme.space.s3)
    .fontSize(theme.fontSizes.l)
    .fontWeight(theme.fontWeights.bold),

  h3: select()
    .marginTop(theme.space.s4)
    .marginBottom(theme.space.s3)
    .fontWeight(theme.fontWeights.bold)
    .fontSize(theme.fontSizes.m),

  h4: select()
    .marginTop(theme.space.s4)
    .marginBottom(theme.space.s3)
    .fontWeight(theme.fontWeights.bold)
    .fontSize(theme.fontSizes.normal),

  h5: select()
    .marginTop(theme.space.s4)
    .marginBottom(theme.space.s3)
    .fontWeight(theme.fontWeights.bold)
    .fontSize(theme.fontSizes.s),

  h6: select()
    .marginTop(theme.space.s4)
    .marginBottom(theme.space.s3)
    .fontWeight(theme.fontWeights.bold)
    .fontSize(theme.fontSizes.xs),
};
