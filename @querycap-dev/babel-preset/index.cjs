const r = (path) => {
  const m = require(path);
  return m.default || m;
};

module.exports = () => ({
  plugins: [
    [
      r("@babel/plugin-transform-runtime"),
      {
        absoluteRuntime: false,
        corejs: { version: 3, proposals: true },
        helpers: true,
        regenerator: true,
        version: "7.x",
      },
    ],
    [r("@babel/plugin-syntax-import-assertions")],
    [r("babel-plugin-typescript-iife-enum")],
    [r("@babel/plugin-transform-typescript"), { isTSX: true }],
    [r("@babel/plugin-transform-react-jsx"), { runtime: "automatic" }],
    [r("@babel/plugin-proposal-class-properties")],
    [r("@babel/plugin-proposal-object-rest-spread")],
    [r("@babel/plugin-proposal-optional-chaining")],
    [r("@babel/plugin-proposal-nullish-coalescing-operator")],
    [r("babel-plugin-pure-calls-annotation")],
  ],
});
