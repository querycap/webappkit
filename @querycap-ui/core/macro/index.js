/// @js-check
const { addDefault, addNamed } = require("@babel/helper-module-imports");
const aliases = require("../aliases.json");
const { createMacro } = require("babel-plugin-macros");

const findLast = (arr, predicate) => {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i])) {
      return arr[i];
    }
  }
};

const insertBeforeStatements = (program, decl) => {
  const targetPath = findLast(program.get("body"), (p) => p.isImportDeclaration());
  if (targetPath) {
    targetPath.insertAfter([decl]);
  } else {
    program.unshiftContainer("body", decl);
  }
};

module.exports = createMacro(({ references, babel: { types: t } }) => {
  const createImporter = (source) => {
    const exports = {};
    return (path, method) => {
      if (!exports[method]) {
        const program = path.isProgram() ? path : path.findParent((p) => p.isProgram());

        const importDeclaration = program
          .get("body")
          .find((p) => p.isImportDeclaration() && p.node.source.value === source);

        if (importDeclaration) {
          const imported = importDeclaration.node.specifiers.find((n) => n.imported.name === method);
          if (imported) {
            exports[method] = imported.local;
          }
        }

        if (!exports[method]) {
          exports[method] = method === "default" ? addDefault(path, source) : addNamed(path, method, source);
        }
      }
      return exports[method];
    };
  };

  const paramT = "__t";

  const importQuerycapUICore = createImporter("@querycap-ui/core");
  const importEmotionCore = createImporter("@emotion/core");

  const objectExpression = (o) => {
    return t.objectExpression(
      Object.keys(o).map((k) =>
        t.objectProperty(/^[A-Za-z_$][A-Za-z0-9_$]+$/.test(k) ? t.identifier(k) : t.stringLiteral(k), o[k]),
      ),
    );
  };

  const callExpression = (callee, ...args) => {
    return t.callExpression(callee, args);
  };

  const arrowFunctionExpression = (returnExpr, ...params) => {
    return t.arrowFunctionExpression(params, returnExpr);
  };

  const createCSSValues = (selector, blocks) => {
    const v = blocks.length === 1 ? blocks[0] : t.arrayExpression(blocks);
    if (selector) {
      return objectExpression({
        [selector]: v,
      });
    }
    return v;
  };

  const asThemeGetter = (path, arg) => {
    return callExpression(callExpression(importQuerycapUICore(path, "fromTheme"), arg), t.identifier(paramT));
  };

  let styleIdx = 0;

  const createCollector = (path) => {
    const program = path.find((p) => p.isProgram());
    const parts = [];
    let needTheme = false;
    let hasStatic = false;
    let hasThemeGetter = false;
    let cssStaticProps = {};
    let cssThemeGetterProps = {};

    const hoistStaticCSS = (o) => {
      const ident = t.identifier(`__style_${styleIdx}`);
      const cssIdent = importEmotionCore(path, "css");

      const callExpr = callExpression(cssIdent, objectExpression(o));

      const decl = t.variableDeclaration("var", [t.variableDeclarator(ident, callExpr)]);

      insertBeforeStatements(program, decl);

      // to register binding
      if (!program.scope.getBinding(cssIdent.name)) {
        program.traverse({
          ImportSpecifier(s) {
            if (s.get("local").node.name === cssIdent.name) {
              program.scope.registerBinding("module", s);
            }
          },
        });
      }

      // update to referencePaths to let emotion to handle
      // todo find better way
      program.scope.path.traverse({
        Identifier(nodePath) {
          if (nodePath.node.name === ident.name) {
            const callExpr = nodePath.parentPath.get("init");
            program.scope.getBinding(cssIdent.name).referencePaths.push(callExpr.get("callee"));
          }
        },
      });

      styleIdx++;
      return ident;
    };

    const swap = () => {
      if (hasStatic) {
        parts.push(hoistStaticCSS(cssStaticProps));
      }
      if (hasThemeGetter) {
        parts.push(objectExpression(cssThemeGetterProps));
      }
      cssStaticProps = {};
      cssThemeGetterProps = {};
      hasStatic = false;
      hasThemeGetter = false;
    };
    return {
      addWith: (arg) => {
        swap();
        parts.push(asThemeGetter(path, arg));
        needTheme = true;
      },
      addStatic: (key, arg) => {
        const add = (k) => (cssStaticProps[k] = arg);
        if (aliases[key]) {
          aliases[key].forEach(add);
        } else {
          add(key);
        }
        hasStatic = true;
      },
      addThemeGetter: (key, arg) => {
        const add = (k) => (cssThemeGetterProps[k] = asThemeGetter(path, arg));
        if (aliases[key]) {
          aliases[key].forEach(add);
        } else {
          add(key);
        }
        hasThemeGetter = true;
        needTheme = true;
      },
      output: () => {
        swap();
        const selector = path.node.arguments.map((s) => s.value).join(", ");
        if (needTheme) {
          return arrowFunctionExpression(createCSSValues(selector, parts), t.identifier(paramT));
        }
        return createCSSValues(selector, parts);
      },
    };
  };

  const transformSelect = (path) => {
    const collector = createCollector(path);

    const resolveCallChain = (path) => {
      if (path.isCallExpression()) {
        const memberExpression = path.parentPath;
        if (memberExpression.isMemberExpression()) {
          if (memberExpression.parentPath.isCallExpression()) {
            const arg = memberExpression.parentPath.node.arguments[0];
            if (arg) {
              if (memberExpression.node.property.name === "with") {
                collector.addWith(arg);
              } else {
                collector[t.isLiteral(arg) && !t.isTemplateLiteral(arg) ? "addStatic" : "addThemeGetter"](
                  memberExpression.node.property.name,
                  arg,
                );
              }
            }
            return resolveCallChain(memberExpression.parentPath);
          }
        }
        return path;
      }
      return;
    };

    const chainRoot = resolveCallChain(path);

    if (chainRoot) {
      chainRoot.replaceWith(collector.output());
    }
  };

  Object.keys(references).forEach((k) => {
    if (k === "select") {
      references[k].reverse().forEach((p) => transformSelect(p.parentPath));
    } else {
      references[k].reverse().forEach((p) => {
        p.node.name = importQuerycapUICore(p, k).name;
      });
    }
  });
});
