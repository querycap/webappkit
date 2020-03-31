// @ts-ignore
import jsx from "@babel/plugin-transform-react-jsx";
// @ts-ignore
import emotion from "babel-plugin-emotion";

import { importEmotionJSXOnlyNeed } from "./import-emotion-jsx-only-need";

export default (_: any, { sourceMap = false, autoLabel, labelFormat, instances }: any) => ({
  plugins: [
    importEmotionJSXOnlyNeed,
    jsx,
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
