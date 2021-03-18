import { has, reduce, toLower, toUpper, upperFirst, words } from "lodash";

const INDENT = "  ";
const LINEBREAK = "\n";

export interface IStringMapper {
  (s: string): string;
}

export const startWith = (prefix: string): IStringMapper => (s: string): string => prefix + String(s);
export const endWith = (suffix: string): IStringMapper => (s: string): string => String(s) + suffix;

export const indent = startWith(INDENT);
export const indentAll = (s: string) => s.split(LINEBREAK).map(indent).join(LINEBREAK);

export const indentAllExpectFirst = (s: string) => indentAll(s).slice(INDENT.length);

export const stringifyArray = (...ss: string[]) => `[${ss.join(", ")}]`;
export const stringifyGeneric = (...ss: string[]) => `<${ss.join(", ")}>`;
export const stringifyParameters = (...ss: string[]) => `(${ss.join(", ")})`;
export const stringifyMembers = (lineEnds = ",", ...ss: string[]) => {
  return `{
${ss.map((s) => indent(endWith(lineEnds)(s))).join("\n")}
}`;
};

export abstract class Stringable {
  set(key: string, value: any): this {
    return new (this.constructor as any)({
      ...(this as any),
      [key]: value,
    });
  }

  reset(key: string): this {
    return this.set(key, undefined);
  }

  abstract toString(): string;
}

export interface IType {
  name: string;
}

export interface IIdentifier {
  name: string;
  optional?: boolean;
  indexer?: Identifier;
  type?: Type;
  value?: Stringable;
  types?: Type[];
  parameters?: Identifier[];
  extends?: Identifier[];
  implements?: Identifier[];
  operators?: [string, string];
}

export class Identifier extends Stringable implements IIdentifier {
  name = "";
  optional?: boolean;
  indexer?: Identifier;
  type?: Type;
  value?: Stringable;
  types?: Type[];
  parameters?: Identifier[];
  "extends": Identifier[];
  implements?: Identifier[];
  operators: [string, string] = [": ", " = "];

  static of(name: string) {
    return new Identifier({
      name,
    });
  }

  constructor(id: IIdentifier) {
    super();
    Object.assign(this, id);
  }

  toString() {
    let result = `${this.name}`;

    if (this.indexer) {
      let i = Identifier.of(this.indexer.name);
      if (this.indexer.type) {
        i = i.typed(this.indexer.type);
      }
      result = `[${i}]`;

      if (this.optional) {
        result += "?";
      }
    }

    if (this.optional && !this.indexer) {
      result = `${this.name}?`;
    }

    if (this.types && this.types.length > 0) {
      result = `${result}${stringifyGeneric(...this.types.map(String))}`;
    }

    if (this.parameters) {
      result = `${result}${stringifyParameters(...this.parameters.map(String))}`;
    }

    if (this.extends && this.extends.length > 0) {
      result = `${result} extends ${this.extends.map(String).join(", ")}`;
    }

    if (this.implements && this.implements.length > 0) {
      result = `${result} implements ${this.implements.map(String).join(", ")}`;
    }

    if (this.type) {
      result = `${result}${this.operators[0]}${this.type.name}`;
    }

    if (this.value) {
      result = `${result}${this.operators[1]}${this.value}`;
    }

    return result;
  }

  operatorsWith(typeOperator?: string, valueOperator?: string) {
    return this.set("operators", [typeOperator || this.operators[0], valueOperator || this.operators[1]]);
  }

  as(typeName: string) {
    return Identifier.of(`${this.name} as ${typeName}`);
  }

  asOptional() {
    return this.set("optional", true);
  }

  indexBy(i: Identifier, optional = false) {
    return this.set("indexer", i).set("optional", optional);
  }

  is(typeName: string) {
    return Identifier.of(`${this.name} is ${typeName}`);
  }

  typed(i: Type) {
    return this.set("type", i);
  }

  generics(...types: Type[]) {
    return this.set("types", types);
  }

  paramsWith(...parameters: Type[]) {
    return this.set("parameters", parameters);
  }

  extendsWith(...identifiers: Array<Identifier | undefined>) {
    return this.set(
      "extends",
      identifiers
        .filter((i) => !!i)
        .map((i: Identifier = {} as Identifier) => {
          return Identifier.of(i.name).generics(...(i.types || []));
        }),
    );
  }

  implementsWith(...identifiers: Identifier[]) {
    return this.set(
      "implements",
      identifiers.map((i) => Identifier.of(i.name).generics(...(i.types || []))),
    );
  }

  valueOf(value: Stringable) {
    return this.set("value", value);
  }
}

export class Type extends Stringable implements IType {
  static of(type: any, composed?: boolean) {
    return new Type(String(type), composed);
  }

  static boolean() {
    return Type.of("boolean");
  }

  static number() {
    return Type.of("number");
  }

  static string() {
    return Type.of("string");
  }

  static any() {
    return Type.of("any");
  }

  static undefined() {
    return Type.of("undefined");
  }

  static unknown() {
    return Type.of("unknown");
  }

  static nothing() {
    return Type.of("-");
  }

  static object() {
    return Type.of("object");
  }

  static null() {
    return Type.of("null");
  }

  static void() {
    return Type.of("void");
  }

  static objectOf(...props: Identifier[]) {
    return Type.composedObjectOf(false, ...props);
  }

  static composedObjectOf(composed: boolean, ...props: Identifier[]) {
    return Type.of(
      stringifyMembers(
        ";",
        ...props.map((i: Identifier) => {
          return `${i
            .typed(Type.of(indentAllExpectFirst(String(i.type || Type.any()))))
            .reset("types")
            .reset("value")}`;
        }),
      ),
      composed,
    );
  }

  static enumOf(...keys: Identifier[]) {
    return Type.of(
      stringifyMembers(
        ",",
        ...keys.map((i: Identifier) => {
          return `${Identifier.of(i.name).valueOf(i.value!)}`;
        }),
      ),
    );
  }

  static arrayOf(type: Type) {
    if (String(type).indexOf(" ") > 0 || String(type).indexOf("<") > 0) {
      return Type.of(`${Identifier.of("Array").generics(type)}`);
    }

    return Type.of(`${type}[]`);
  }

  static tupleOf(...types: Type[]) {
    return Type.of(stringifyArray(...types.map(String)));
  }

  static additionalTupleOf(additionalType: Type, ...types: Type[]) {
    return Type.of(stringifyArray(...types.map(String), `...${additionalType}[]`));
  }

  static intersectionOf(...types: Type[]) {
    return Type.of(types.filter((t) => t.name !== "-").join(" & "), true);
  }

  static unionOf(...types: Type[]) {
    return Type.of(types.filter((t) => t.name !== "-").join(" | "), true);
  }

  constructor(public name: string, public composed?: boolean) {
    super();
  }

  toString() {
    return `${this.name}`;
  }
}

export class Value extends Stringable {
  value: any;

  static of(value: any) {
    return new Value(JSON.stringify(value));
  }

  static arrayOf(...items: Stringable[]) {
    return new Value(stringifyArray(...items.map(String)));
  }

  static objectOf(...props: Identifier[]) {
    return new Value(
      stringifyMembers(
        ",",
        ...props.map((i: IIdentifier) => {
          let id = Identifier.of(i.name);

          if (i.value) {
            id = id.valueOf(Identifier.of(indentAllExpectFirst(String(i.value))));
          }

          return `${id.operatorsWith(undefined, ": ")}`;
        }),
      ),
    );
  }

  static bodyOf(...bodies: Stringable[]) {
    return new Value(stringifyMembers(";", ...bodies.map(String)));
  }

  static memberOf(...members: Stringable[]) {
    return new Value(stringifyMembers(";", ...members.map(String)));
  }

  constructor(value: any) {
    super();
    this.value = value;
  }

  toString() {
    return this.value;
  }
}

export interface IDecl {
  identifier: Identifier;
  kind?: string;
}

export class Decl extends Stringable implements IDecl {
  identifier: Identifier = Identifier.of("undefined");
  kind?: string;

  static returnOf(identifier: Identifier) {
    return Decl.of(Identifier.of(indentAllExpectFirst(String(identifier)))).asKind("return");
  }

  static const(identifier: Identifier) {
    return Decl.of(identifier).asKind("const");
  }

  static let(identifier: Identifier) {
    return Decl.of(identifier).asKind("let");
  }

  static static(identifier: Identifier) {
    return Decl.of(identifier).asKind("static");
  }

  static private(identifier: Identifier) {
    return Decl.of(identifier).asKind("private");
  }

  static public(identifier: Identifier) {
    return Decl.of(identifier).asKind("public");
  }

  static method(identifier: Identifier) {
    return Decl.of(
      Identifier.of(identifier.name)
        .operatorsWith(": ", " ")
        .typed(identifier.type!)
        .generics(...(identifier.types || []))
        .paramsWith(...(identifier.parameters || []))
        .valueOf(identifier.value!),
    );
  }

  static func(identifier: Identifier) {
    return Decl.method(identifier).asKind("function");
  }

  static type(identifier: Identifier) {
    return Decl.of(
      Identifier.of(identifier.name)
        .operatorsWith(" = ", " ")
        .typed(identifier.type!)
        .generics(...(identifier.types || [])),
    ).asKind("type");
  }

  // interface A<T> {
  //   key: T;
  // }
  static interface(identifier: Identifier) {
    return Decl.of(
      Identifier.of(identifier.name)
        .operatorsWith(" ", undefined)
        .typed(identifier.type!)
        .generics(...(identifier.types || []))
        .extendsWith(...(identifier.extends || [])),
    ).asKind("interface");
  }

  static class(identifier: Identifier) {
    return Decl.of(
      Identifier.of(identifier.name)
        .operatorsWith(" ", " ")
        .valueOf(identifier.value!)
        .generics(...identifier.types!)
        .extendsWith(identifier.extends ? identifier.extends[0] : undefined)
        .implementsWith(...(identifier.implements || [])),
    ).asKind("class");
  }

  // enum A {
  //   key = 1,
  //   key2,
  // }
  static enum(identifier: Identifier) {
    return Decl.of(Identifier.of(identifier.name).operatorsWith(" ", " ").valueOf(identifier.value!)).asKind("enum");
  }

  static of(identifier: Identifier) {
    return new Decl({ identifier });
  }

  constructor(decl: IDecl) {
    super();
    Object.assign(this, decl);
  }

  asKind(kind: string) {
    return this.set("kind", kind);
  }

  toString() {
    let result = `${this.identifier}`;

    if (this.kind) {
      result = `${this.kind} ${result}`;
    }

    return result;
  }
}

export interface IModuleImport {
  path: string;
  all?: string;
  default?: string;
  members?: string[];
}

export class ModuleImport extends Stringable implements IModuleImport {
  path = "";
  all?: string;
  default?: string;
  members?: string[];

  static from(path: string) {
    return new ModuleImport({
      path,
    });
  }

  constructor(module: IModuleImport) {
    super();
    Object.assign(this, module);
  }

  allAs(i: Identifier) {
    return this.set("all", Identifier.of("*").as(i.name));
  }

  defaultAs(i: Identifier) {
    return this.set("default", i.name);
  }

  membersAs(...members: Identifier[]) {
    return this.set(
      "members",
      members.map((i) => i.name),
    );
  }

  toString() {
    if (this.all) {
      return `import ${this.all} from ${Value.of(this.path)}`;
    }

    if (this.default || this.members) {
      const members: string[] = [];

      if (this.default) {
        members.push(`${this.default}`);
      }

      if (this.members) {
        members.push(stringifyMembers(",", ...this.members));
      }

      return `import ${members.join(", ")} from ${Value.of(this.path)}`;
    }

    return `import ${Value.of(this.path)}`;
  }
}

export interface IModuleExport {
  members?: string[];
}

export class ModuleExport extends Stringable implements IModuleExport {
  members: string[] = [];

  static decl(decl: Decl) {
    return new ModuleExport({
      members: [`${decl}`],
    });
  }

  static of(...members: Identifier[]) {
    return new ModuleExport({
      members: members.map((i) => i.name),
    });
  }

  constructor(module: IModuleExport) {
    super();
    Object.assign(this, module);
  }

  toString() {
    if (this.members.length > 1) {
      return `export ${stringifyMembers(",", ...this.members.map(String))}`;
    }

    return `export ${this.members[0]}`;
  }
}

export const reservedWords = [
  "abstract",
  "await",
  "boolean",
  "break",
  "byte",
  "case",
  "catch",
  "char",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "double",
  "else",
  "enum",
  "export",
  "extends",
  "false",
  "final",
  "finally",
  "float",
  "for",
  "function",
  "goto",
  "if",
  "implements",
  "import",
  "in",
  "instanceof",
  "int",
  "interface",
  "let",
  "long",
  "native",
  "new",
  "null",
  "package",
  "private",
  "protected",
  "public",
  "return",
  "short",
  "static",
  "super",
  "switch",
  "synchronized",
  "this",
  "throw",
  "throws",
  "transient",
  "true",
  "try",
  "typeof",
  "var",
  "void",
  "volatile",
  "while",
  "with",
  "yield",
];

// https://github.com/golang/lint/blob/master/lint.go#L720
const commonInitialisms = {
  ACL: true,
  API: true,
  ASCII: true,
  CPU: true,
  CSS: true,
  DNS: true,
  EOF: true,
  GUID: true,
  HTML: true,
  HTTP: true,
  HTTPS: true,
  ID: true,
  IP: true,
  JSON: true,
  LHS: true,
  QPS: true,
  RAM: true,
  RHS: true,
  RPC: true,
  SLA: true,
  SMTP: true,
  SQL: true,
  SSH: true,
  TCP: true,
  TLS: true,
  TTL: true,
  UDP: true,
  UI: true,
  UID: true,
  UUID: true,
  URI: true,
  URL: true,
  UTF8: true,
  VM: true,
  XML: true,
  XMPP: true,
  XSRF: true,
  XSS: true,
};

/** IdentifierName can be written as unquoted property names, but may be reserved words. */
export const isIdentifierName = (s: string) => /^[$A-Z_][0-9A-Z_$]*$/i.test(s);

/** Identifiers are e.g. legal variable names. They may not be reserved words */
export const isIdentifier = (s: string) => isIdentifierName(s) && !reservedWords.includes(s);

export const safeKey = (key: string): string => (isIdentifier(key) ? key : JSON.stringify(key));

export const toCamel = (word: string): string => {
  const upperString = toUpper(word);
  if (has(commonInitialisms, upperString)) {
    return upperString;
  }
  return upperFirst(toLower(upperString));
};

export const toLowerCamelCase = (s: string): string => {
  return reduce(
    words(s),
    (result, word, idx) => {
      return result + (idx > 0 ? toCamel(word) : toLower(word));
    },
    "",
  );
};

export const toUpperCamelCase = (s: string): string => {
  return reduce(
    words(s),
    (result, word) => {
      return result + toCamel(word);
    },
    "",
  );
};
