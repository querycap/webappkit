// @ts-ignore
import jsx from "@babel/plugin-transform-react-jsx";
// @ts-ignore
import emotion from "@emotion/babel-plugin";

import { importEmotionJSXOnlyNeed } from "./import-emotion-jsx-only-need";

export default (_: any, { sourceMap = false, autoLabel, labelFormat, instances }: any) => ({
  plugins: [
    importEmotionJSXOnlyNeed,
    [jsx, { runtime: "automatic" }],
    [
      emotion,
      {
        sourceMap,
        autoLabel,
        labelFormat,
        instances,
        cssPropOptimization: true,
      },
    ],
  ],
});
