import { NodePath } from "@babel/traverse";

import {
  callExpression,
  Expression,
  Identifier,
  identifier,
  importDeclaration,
  importSpecifier,
  isArrowFunctionExpression,
  isCallExpression,
  isIdentifier,
  isImportDeclaration,
  JSXIdentifier,
  Program,
  stringLiteral,
  VariableDeclarator,
} from "@babel/types";

const isAccessControlEveryComponentOrHook = (id = "") => /^(use)?Ac(Every)?[A-Z].+/.test(id);
const isAccessControlSomeComponentOrHook = (id = "") => /^(use)?AcSome[A-Z].+/.test(id);

const isAccessControlComponentOrHook = (id = "") =>
  isAccessControlEveryComponentOrHook(id) || isAccessControlSomeComponentOrHook(id);

const isUseRequestHook = (id = "") => /^use(\w+)?Request$/.test(id);

const isCreateRequestMethod = (id = "") => /create(\w+)?Request$/.test(id);

const isNeedToMarkedAccessControlExpression = (opts: State["opts"], e: Expression | null): boolean => {
  if (isArrowFunctionExpression(e)) {
    return true;
  }

  if (isCallExpression(e)) {
    if (isIdentifier(e.callee)) {
      const callName = e.callee.name;

      return !(callName === opts.methodAccessControlEvery || callName === opts.methodAccessControlSome);
    } else if (isCallExpression(e.callee) && isIdentifier(e.callee.callee)) {
      const callName = e.callee.callee.name;

      return !(callName === opts.methodAccessControlEvery || callName === opts.methodAccessControlSome);
    }
  }
  return false;
};

const scanDeps = (nodePath: NodePath, ...excludes: string[]): Identifier[] => {
  const ids: { [k: string]: true } = {};

  nodePath.traverse({
    JSXIdentifier(nodePath: NodePath<JSXIdentifier>) {
      if (isAccessControlComponentOrHook(nodePath.node.name) && !excludes.includes(nodePath.node.name)) {
        ids[nodePath.node.name] = true;
      }
    },
    Identifier(nodePath: NodePath<Identifier>) {
      if (isCallExpression(nodePath.parent)) {
        if (isUseRequestHook(nodePath.node.name) || isCreateRequestMethod(nodePath.node.name)) {
          const arg0 = nodePath.parent.arguments[0];

          if (isIdentifier(arg0)) {
            ids[arg0.name] = true;
          }
        }

        if (isAccessControlComponentOrHook(nodePath.node.name)) {
          ids[nodePath.node.name] = true;
        }
      }
    },
  });

  return Object.keys(ids)
    .sort()
    .map((id) => identifier(id));
};

function importMethodTo(path: NodePath<Program>, method: string, mod: string) {
  const importDecl = importDeclaration([importSpecifier(identifier(method), identifier(method))], stringLiteral(mod));

  const targetPath = findLast(path.get("body") as NodePath[], (p) => isImportDeclaration(p));

  if (targetPath) {
    targetPath.insertAfter([importDecl]);
  } else {
    if (path.get("body")) {
      (path.get("body") as NodePath[])[0].insertBefore(importDecl);
    }
  }
}

function findLast<T>(arr: T[], predicate: (item: T) => boolean): T | null {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (predicate(arr[i])) {
      return arr[i];
    }
  }
  return null;
}

interface State {
  opts: {
    libAccessControl: string;
    methodAccessControlSome: string;
    methodAccessControlEvery: string;
  };
  methodAccessControlSomeUsed?: boolean;
  methodAccessControlEveryUsed?: boolean;
}

function resolveOpts(opts: State["opts"] = {} as any) {
  return {
    libAccessControl: opts.libAccessControl || "@querycap/access",
    methodAccessControlSome: opts.methodAccessControlSome || "mustOneOfPermissions",
    methodAccessControlEvery: opts.methodAccessControlEvery || "mustAllOfPermissions",
  };
}

function argsFromExpr(e: Expression, id: Identifier) {
  if (id.name.startsWith("use")) {
    return [e as any, identifier("true")];
  }
  return [e];
}

export default () => ({
  name: "access-control-autocomplete",
  visitor: {
    Program: {
      exit(nodePath: NodePath<Program>, state: State) {
        const opts = resolveOpts(state.opts);

        if (state.methodAccessControlEveryUsed && !nodePath.scope.hasBinding(opts.methodAccessControlEvery)) {
          importMethodTo(nodePath, opts.methodAccessControlEvery, opts.libAccessControl);
        }

        if (state.methodAccessControlSomeUsed && !nodePath.scope.hasBinding(opts.methodAccessControlSome)) {
          importMethodTo(nodePath, opts.methodAccessControlSome, opts.libAccessControl);
        }
      },
    },
    VariableDeclarator: {
      enter(nodePath: NodePath<VariableDeclarator>, state: State) {
        const opts = resolveOpts(state.opts);

        if (
          isIdentifier(nodePath.node.id) &&
          isAccessControlComponentOrHook(nodePath.node.id.name) &&
          isNeedToMarkedAccessControlExpression(opts, nodePath.node.init)
        ) {
          if (isAccessControlSomeComponentOrHook(nodePath.node.id.name)) {
            state.methodAccessControlSomeUsed = true;

            nodePath.replaceWith({
              ...nodePath.node,
              init: callExpression(
                callExpression(
                  identifier(opts.methodAccessControlSome),
                  scanDeps(nodePath.get("init") as NodePath, nodePath.node.id.name),
                ),
                argsFromExpr(nodePath.node.init!, nodePath.node.id),
              ),
            });
          } else if (isAccessControlEveryComponentOrHook(nodePath.node.id.name)) {
            state.methodAccessControlEveryUsed = true;

            nodePath.replaceWith({
              ...nodePath.node,
              init: callExpression(
                callExpression(
                  identifier(opts.methodAccessControlEvery),
                  scanDeps(nodePath.get("init") as NodePath, nodePath.node.id.name),
                ),
                argsFromExpr(nodePath.node.init!, nodePath.node.id),
              ),
            });
          }
        }
      },
    },
  },
});
