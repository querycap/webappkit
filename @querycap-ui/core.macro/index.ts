import { Node, NodePath } from "@babel/core";
import generate from "@babel/generator";
// @ts-ignore
import { addDefault, addNamed } from "@babel/helper-module-imports";
import * as t from "@babel/types";
import {
  CallExpression,
  Expression,
  Function,
  Identifier,
  Program,
  V8IntrinsicIdentifier,
  VariableDeclarator,
} from "@babel/types";
import { serializeStyles } from "@emotion/serialize";
import { aliases as aliasesOrigin } from "@querycap-ui/css-aliases";
import { createMacro } from "babel-plugin-macros";

const aliases: { [k: string]: string[] } = aliasesOrigin;

const createImporter = (path: NodePath, source: string) => {
  const exports: { [k: string]: Identifier } = {};
  const program = path.isProgram() ? path : path.findParent((p) => p.isProgram());

  return (method: string): Identifier => {
    if (!exports[method]) {
      const importDeclaration = program
        .get("body")
        .find((p) => p.isImportDeclaration() && p.node.source.value === source);

      if (importDeclaration) {
        const importSpecifier = importDeclaration
          .get("specifiers")
          .find((n) => n.isImportSpecifier() && n.node.imported.name === method);

        if (importSpecifier && importSpecifier.isImportSpecifier()) {
          exports[method] = importSpecifier.node.local;
        }
      }

      if (!exports[method]) {
        exports[method] = method === "default" ? addDefault(path, source) : addNamed(path, method, source);
      }
    }
    return exports[method];
  };
};

const generatedPrefix = "__macro_generated_";

const isGenerated = (id: string) => id.startsWith(generatedPrefix);

const createScanner = (program: NodePath<Program>) => {
  const querycapUICoreImport = createImporter(program, "@querycap-ui/core");

  const objectExpression = (o: { [k: string]: Expression }) => {
    return t.objectExpression(
      Object.keys(o).map((k) => {
        const key = /^[A-Za-z_$][A-Za-z0-9_$]+$/.test(k) ? t.identifier(k) : t.stringLiteral(k);
        return t.objectProperty(key, o[k]);
      }),
    );
  };

  const callExpression = (callee: Expression | V8IntrinsicIdentifier, ...args: Expression[]) => {
    return t.callExpression(callee, args);
  };

  const themeNeedMark = "__THEME_NEED__";
  const hasThemeNeed = (node: Node) => {
    return node.leadingComments && node.leadingComments.find((c) => c.value == themeNeedMark);
  };

  const markThemeNeed = <T extends Node>(node: T) => {
    if (hasThemeNeed(node)) {
      return node;
    }
    return t.addComment(node, "leading", themeNeedMark);
  };

  const withFromTheme = (arg: Expression) => {
    return callExpression(querycapUICoreImport("fromTheme"), arg);
  };

  const asThemeGetter = (returnExpr: Expression) =>
    t.arrowFunctionExpression([t.identifier(generatedPrefix + "t")], returnExpr);

  const createHoisting = () => {
    let styleIdx = 0;

    return (nodePath: NodePath, expr: Expression): NodePath<VariableDeclarator> | undefined => {
      const ident = t.identifier(`${generatedPrefix}ref_${styleIdx}`);
      const decl = t.variableDeclaration("var", [t.variableDeclarator(ident, expr)]);

      const ownerDecl = nodePath.findParent((p) => p.parentPath.isProgram());
      const inserted = ownerDecl.insertBefore([decl])[0];

      styleIdx++;

      return inserted && ((inserted.get("declarations") as NodePath[])[0] as NodePath<VariableDeclarator>);
    };
  };

  const hoistAsVariable = createHoisting();

  const hoistStaticCSS = (nodePath: NodePath, o: { [k: string]: Expression }) => {
    const cssObject = generate(objectExpression(o))?.code;

    const res = serializeStyles([eval(`(${cssObject})`)], {});

    const variableDeclarator = hoistAsVariable(
      nodePath,
      objectExpression({
        name: t.stringLiteral(res.name),
        styles: t.stringLiteral(res.styles),
      }),
    )!;

    return variableDeclarator.node.id as Identifier;
  };

  const createCollector = (nodePath: NodePath, selectors: any[]) => {
    const parts: any[] = [];

    let needTheme = false;
    let hasStatic = false;
    let hasThemeGetter = false;
    let cssStaticProps: { [k: string]: Expression } = {};
    let cssThemeGetterProps: { [k: string]: Expression } = {};

    const swap = () => {
      if (hasStatic) {
        parts.push(hoistStaticCSS(nodePath, cssStaticProps));
      }

      if (hasThemeGetter) {
        parts.push(objectExpression(cssThemeGetterProps));
      }

      cssStaticProps = {};
      cssThemeGetterProps = {};
      hasStatic = false;
      hasThemeGetter = false;
    };

    const callWithTheme = (arg: Expression) => {
      needTheme = true;
      return callExpression(arg, t.identifier(generatedPrefix + "t"));
    };

    const createCSSValues = (blocks: any[]) => {
      const toObject = () => {
        const v = blocks.length === 1 ? blocks[0] : t.arrayExpression(blocks);
        if (selectors.length > 0) {
          const key = callExpression(querycapUICoreImport("selectKeys"), ...selectors);
          return t.objectExpression([t.objectProperty(key, v, true)]);
        }
        return v;
      };

      if (needTheme) {
        return markThemeNeed(asThemeGetter(toObject()));
      }

      return toObject();
    };

    return {
      addWith: (path: NodePath<Expression>) => {
        swap();

        if (hasThemeNeed(path.node) || path.isIdentifier()) {
          parts.push(callWithTheme(withFromTheme(path.node)));
        } else {
          parts.push(path.node);
        }
      },

      addStatic: (key: string, path: NodePath<Expression>) => {
        const add = (k: string) => (cssStaticProps[k] = path.node);
        if (aliases[key]) {
          aliases[key].forEach(add);
        } else {
          add(key);
        }
        hasStatic = true;
      },

      addThemeGetter: (key: string, path: NodePath<Expression>) => {
        const add = (k: string) => (cssThemeGetterProps[k] = callWithTheme(withFromTheme(path.node)));
        if (aliases[key]) {
          aliases[key].forEach(add);
        } else {
          add(key);
        }
        hasThemeGetter = true;
      },

      emitTo: (chainRoot: NodePath) => {
        swap();

        const result = createCSSValues(parts);

        if (t.isIdentifier(result)) {
          chainRoot.replaceWith(result);
          return;
        }

        chainRoot.replaceWith(withFromTheme(result));

        const createFunctionIfNeed = () => {
          const paramSet: { [k: string]: Identifier } = {};

          chainRoot.traverse(
            {
              Function: {
                enter(nodePath, state: any) {
                  state.funcNodePath = nodePath;
                },
                exit(_, state: any) {
                  delete state.funcNodePath;
                },
              },
              Identifier(nodePath: NodePath<Identifier>, state: any) {
                if (!nodePath.isReferencedIdentifier()) {
                  return;
                }

                if (program.scope.hasBinding(nodePath.node.name)) {
                  return;
                }

                if (isGenerated(nodePath.node.name)) {
                  return;
                }

                if (
                  state.funcNodePath &&
                  (state.funcNodePath as NodePath<Function>).scope.hasOwnBinding(nodePath.node.name)
                ) {
                  return;
                }

                paramSet[nodePath.node.name] = nodePath.node;
              },
            },
            {},
          );

          const params = Object.values(paramSet);

          if (params.length === 0) {
            const variableDeclarator = hoistAsVariable(nodePath, result)!;
            return t.clone(variableDeclarator.node.id as Identifier);
          }

          const variableDeclarator = hoistAsVariable(nodePath, t.arrowFunctionExpression(params, result))!;
          return callExpression(variableDeclarator.node.id as Identifier, ...params);
        };

        if (needTheme) {
          chainRoot.replaceWith(markThemeNeed(createFunctionIfNeed()));
          if (chainRoot.parentPath.isExpression()) {
            markThemeNeed(chainRoot.parentPath.node);
          }
        } else {
          chainRoot.replaceWith(createFunctionIfNeed());
        }
      },
    };
  };

  return {
    scan: (path: NodePath<CallExpression>) => {
      const collector = createCollector(path, path.node.arguments);

      const resolveCallChain = (path: NodePath<CallExpression>): NodePath => {
        const memberExpression = path.parentPath;

        if (memberExpression.isMemberExpression()) {
          if (memberExpression.parentPath.isCallExpression()) {
            const arg = memberExpression.parentPath.get("arguments")[0] as NodePath<Expression>;

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

            // resolve chain
            if (memberExpression.parentPath.isCallExpression()) {
              return resolveCallChain(memberExpression.parentPath);
            }
          }
        }

        return path;
      };

      const chainRoot = resolveCallChain(path);

      if (chainRoot) {
        collector.emitTo(chainRoot);
      }
    },
  };
};

export default createMacro(({ references }) => {
  Object.keys(references).forEach((k) => {
    if (references[k].length > 0) {
      if (k === "select") {
        const program = references[k][0].findParent((p) => p.isProgram()) as NodePath<Program>;
        const scanner = createScanner(program);
        references[k].reverse().forEach((p) => {
          return p.parentPath.isCallExpression() && scanner.scan(p.parentPath);
        });
      } else {
        const querycapUICoreImport = createImporter(references[k][0], "@querycap-ui/core");

        references[k].forEach((p) => {
          (p as NodePath<Identifier>).node.name = querycapUICoreImport(k).name;
        });
      }
    }
  });
});
