/* eslint-disable */
var _jsx = require("@emotion/core").jsx;
var assign = require("@babel/runtime-corejs3/core-js/object/assign");

function jsx(Component, props, maybeKey) {
  const children = props.children;
  delete props.children;
  return _jsx.apply(null, [Component, maybeKey ? assign(props, { key: maybeKey }) : props].concat(children));
}

exports.jsx = jsx;
exports.jsxs = jsx;
exports.Fragment = require("react").Fragment;
