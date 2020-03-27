require("ts-node/register");

const r = (pkg) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires,no-undef
  const m = require(pkg);
  return m.default || m;
};

module.exports = (_, { sourceMap = false, autoLabel, labelFormat, instances }) => ({
  plugins: [
    require("./import-emotion-jsx-only-need").importEmotionJSXOnlyNeed,
    r("@babel/plugin-transform-react-jsx"),
    [
      r("babel-plugin-emotion"),
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
