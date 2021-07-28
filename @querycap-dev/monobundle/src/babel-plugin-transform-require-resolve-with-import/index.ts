import type { NodePath, Node, PluginObj } from "@babel/core";
import type { CallExpression } from "@babel/types";
import * as t from "@babel/types";

const mark = "__require_resolve_with_import__";

const transformedResolve = (node: Node) => {
  return node.leadingComments && node.leadingComments.find((c) => c.value == mark);
};

export default () => {
  return {
    name: "babel-plugin-transform-require-resolve-with-import",
    visitor: {
      CallExpression(nodePath: NodePath<CallExpression>) {
        const calleeNodePath = nodePath.get("callee") as NodePath;

        if (!transformedResolve(nodePath.node) && calleeNodePath.isMemberExpression()) {
          const propertyNodePath = calleeNodePath.get("property") as NodePath;
          const objectNodePath = calleeNodePath.get("object") as NodePath;

          if (propertyNodePath.isIdentifier() && propertyNodePath.node.name === "resolve") {
            if (objectNodePath.isIdentifier() && objectNodePath.node.name === "require") {
              const arg = nodePath.get("arguments")[0];

              if (arg.isLiteral()) {
                const pair = t.arrayExpression([
                  t.addComment(t.clone(nodePath.node), "leading", mark),
                  t.arrowFunctionExpression([], t.callExpression(t.identifier("import"), [arg.node])),
                ]);

                nodePath.replaceWith(t.memberExpression(pair, t.numericLiteral(0), true));
              }
            }
          }
        }
      },
    },
  } as PluginObj;
};
