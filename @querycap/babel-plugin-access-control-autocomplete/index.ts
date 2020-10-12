// @ts-ignore
import { addDefault, addNamed } from "@babel/helper-module-imports";
import type { NodePath } from "@babel/traverse";
import {
  callExpression,
  Expression,
  Identifier,
  identifier,
  isArrowFunctionExpression,
  isCallExpression,
  isIdentifier,
  JSXIdentifier,
  Program,
  stringLiteral,
  VariableDeclarator,
} from "@babel/types";

const createImporter = (path: NodePath<any>, source: string) => {
  const exports: { [k: string]: Identifier } = {};
  const locals: { [k: string]: Identifier } = {};

  const program = path.isProgram() ? path : path.findParent((p) => p.isProgram())!;

  const collect = (exportName: string, local: Identifier) => {
    exports[exportName] = local;
    locals[local.name] = local;
  };

  return {
    has: (ident: Identifier) => {
      return !!locals[ident.name];
    },
    use: (method: string): Identifier => {
      if (!exports[method]) {
        const importDeclaration = program
          .get("body")
          .find((p) => p.isImportDeclaration() && p.node.source.value === source);

        // already imported
        if (importDeclaration) {
          const importSpecifier = importDeclaration
            .get("specifiers")
            .find((n) => n.isImportSpecifier() && n.node.imported.name === method);

          if (importSpecifier && importSpecifier.isImportSpecifier()) {
            collect(method, importSpecifier.node.local);
          }
        }

        if (!exports[method]) {
          collect(method, method === "default" ? addDefault(path, source) : addNamed(path, method, source));
        }
      }
      return exports[method];
    },
  };
};

const isAccessControlEveryComponentOrHook = (id = "") => /^(use)?Ac(Every)?[A-Z].+/.test(id);
const isAccessControlSomeComponentOrHook = (id = "") => /^(use)?AcSome[A-Z].+/.test(id);

const isAccessControlComponentOrHook = (id = "") =>
  isAccessControlEveryComponentOrHook(id) || isAccessControlSomeComponentOrHook(id);

const isUseRequestHook = (id = "") => /^use(\w+)?Request$/.test(id);

const isCreateRequestMethod = (id = "") => /create(\w+)?Request$/.test(id);

const isNeedToMarkedAccessControlExpression = (
  importer: ReturnType<typeof createImporter>,
  e: Expression | null,
): boolean => {
  if (isArrowFunctionExpression(e)) {
    return true;
  }

  if (isCallExpression(e)) {
    if (isIdentifier(e.callee)) {
      return !importer.has(e.callee);
    } else if (isCallExpression(e.callee) && isIdentifier(e.callee.callee)) {
      return !importer.has(e.callee.callee);
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

interface State {
  opts: {
    libAccessControl: string;
    methodAccessControlSome: string;
    methodAccessControlEvery: string;
  };
  methodAccessControlSomeUsed?: boolean;
  methodAccessControlEveryUsed?: boolean;
}

const resolveOpts = (opts: State["opts"] = {} as any) => ({
  libAccessControl: opts.libAccessControl || "@querycap/access",
  methodAccessControlSome: opts.methodAccessControlSome || "mustOneOfPermissions",
  methodAccessControlEvery: opts.methodAccessControlEvery || "mustAllOfPermissions",
});

export default () => ({
  name: "access-control-autocomplete",
  visitor: {
    Program(programNodePath: NodePath<Program>, state: State) {
      const opts = resolveOpts(state.opts);
      const pkg = createImporter(programNodePath, opts.libAccessControl);

      programNodePath.traverse({
        VariableDeclarator: {
          enter(variableDeclPath: NodePath<VariableDeclarator>) {
            if (
              isIdentifier(variableDeclPath.node.id) &&
              isAccessControlComponentOrHook(variableDeclPath.node.id.name)
            ) {
              const id = variableDeclPath.node.id;

              const wrap = (method: string) => {
                const ident = pkg.use(method);

                if (isNeedToMarkedAccessControlExpression(pkg, variableDeclPath.node.init)) {
                  const isHook = id.name.startsWith("use");

                  variableDeclPath.replaceWith({
                    ...variableDeclPath.node,
                    init: callExpression(
                      callExpression(ident, scanDeps(variableDeclPath.get("init") as NodePath, id.name)),
                      [variableDeclPath.node.init!, identifier(isHook ? "true" : "false"), stringLiteral(id.name)],
                    ),
                  });
                }
              };

              if (isAccessControlSomeComponentOrHook(id.name)) {
                wrap(opts.methodAccessControlSome);
              } else if (isAccessControlEveryComponentOrHook(id.name)) {
                wrap(opts.methodAccessControlEvery);
              }
            }
          },
        },
      });
    },
  },
});
