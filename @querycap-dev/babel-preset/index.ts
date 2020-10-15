// @ts-ignore
import pluginProposalClassProperties from "@babel/plugin-proposal-class-properties";
// @ts-ignore
import pluginProposalNullishCoalescingOperator from "@babel/plugin-proposal-nullish-coalescing-operator";
// @ts-ignore
import pluginProposalObjectRestSpread from "@babel/plugin-proposal-object-rest-spread";
// @ts-ignore
import pluginProposalOptionalChaining from "@babel/plugin-proposal-optional-chaining";
// @ts-ignore
import pluginTransformReactJSX from "@babel/plugin-transform-react-jsx";
// @ts-ignore
import pluginTransformRuntime from "@babel/plugin-transform-runtime";
// @ts-ignore
import pluginTransformTypescript from "@babel/plugin-transform-typescript";
// @ts-ignore
import macros from "babel-plugin-macros";
import pluginPureCallsAnnotation from "babel-plugin-pure-calls-annotation";
import pluginTypescriptIifeEnum from "babel-plugin-typescript-iife-enum";

export default () => ({
  plugins: [
    macros,
    [
      pluginTransformRuntime,
      {
        absoluteRuntime: false,
        corejs: { version: 3, proposals: true },
        helpers: true,
        regenerator: true,
        version: "7.9.x",
      },
    ],
    [pluginTypescriptIifeEnum],
    [pluginTransformTypescript, { isTSX: true }],
    [pluginTransformReactJSX, { "runtime": "automatic"  }],
    [pluginProposalClassProperties],
    [pluginProposalObjectRestSpread],
    [pluginProposalOptionalChaining],
    [pluginProposalNullishCoalescingOperator],
    [pluginPureCallsAnnotation],
  ],
});
