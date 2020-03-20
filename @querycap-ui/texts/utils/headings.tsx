import { selector, themes } from "@querycap-ui/core";

export const headings = {
  break: selector()
    .paddingBottom(themes.space.s1)
    .borderWidth(1)
    .borderStyle("solid")
    .borderColor(themes.colors.border),

  h1: selector()
    .marginTop(themes.space.s4)
    .marginBottom(themes.space.s3)
    .fontSize(themes.fontSizes.xl)
    .fontWeight(themes.fontWeights.bold),

  h2: selector()
    .marginTop(themes.space.s4)
    .marginBottom(themes.space.s3)
    .fontSize(themes.fontSizes.l)
    .fontWeight(themes.fontWeights.bold),

  h3: selector()
    .marginTop(themes.space.s4)
    .marginBottom(themes.space.s3)
    .fontWeight(themes.fontWeights.bold)
    .fontSize(themes.fontSizes.m),

  h4: selector()
    .marginTop(themes.space.s4)
    .marginBottom(themes.space.s3)
    .fontWeight(themes.fontWeights.bold)
    .fontSize(themes.fontSizes.normal),

  h5: selector()
    .marginTop(themes.space.s4)
    .marginBottom(themes.space.s3)
    .fontWeight(themes.fontWeights.bold)
    .fontSize(themes.fontSizes.s),

  h6: selector()
    .marginTop(themes.space.s4)
    .marginBottom(themes.space.s3)
    .fontWeight(themes.fontWeights.bold)
    .fontSize(themes.fontSizes.xs),
};
