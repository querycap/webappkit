import { drop } from "lodash";
import React from "react";

export interface TagNode {
  valid: () => boolean;
  toString: () => string;
  toJSX: () => JSX.Element;
}

enum ConditionOperator {
  AND = "&",
  OR = "|",
}

class Condition {
  constructor(public operator: ConditionOperator, public left?: TagNode, public right?: TagNode) {}

  valid(): boolean {
    return !!this.left && this.left.valid() && !!this.right && this.right.valid();
  }

  toString(): string {
    return [this.left, this.right]
      .map((n) => {
        if (n instanceof Condition) {
          return `(${n})`;
        }
        return `${n}`;
      })
      .join(` ${this.operator} `);
  }

  toJSX(): JSX.Element {
    return (
      <span className={"exp-condition"}>
        <span className={"exp-node"}>{this.left && this.left.toJSX()}</span>
        <span className={"exp-op"}>{this.operator}</span>
        <span className={"exp-node"}>{this.right && this.right.toJSX()}</span>
      </span>
    );
  }
}

export const and = (...nodes: TagNode[]): TagNode => {
  if (nodes.length <= 1) {
    return nodes[0];
  }
  return new Condition(ConditionOperator.AND, nodes[0], and(...drop(nodes, 1)));
};

export const or = (...nodes: TagNode[]): TagNode => {
  if (nodes.length <= 1) {
    return nodes[0];
  }
  return new Condition(ConditionOperator.OR, nodes[0], and(...drop(nodes, 1)));
};

enum RuleOperator {
  EXISTS = "",
  EQUAL = "=",
  NOT_EQUAL = "!=",
  CONTAINS = "*=",
  STARTS_WITH = "^=",
  ENDS_WITH = "$=",
}

class Rule {
  constructor(public operator: RuleOperator, public key: string, public value?: string) {}

  valid(): boolean {
    if (this.operator) {
      return !!this.key && !!this.value;
    }
    return !!this.key;
  }

  toString(): string {
    return `${this.key}${this.operator ? ` ${this.operator} ${JSON.stringify(this.value)}` : ""}`;
  }

  toJSX(): JSX.Element {
    return (
      <span>
        <span className={"exp-key"}>{this.key}</span>
        {this.operator && (
          <>
            <span className={"exp-op"}>{this.operator}</span>
            <span className={"exp-value"}>{this.value && this.value}</span>
          </>
        )}
      </span>
    );
  }
}

export const key = (key: string) => {
  return {
    exists: () => new Rule(RuleOperator.EXISTS, key),
    eq: (value: string) => new Rule(RuleOperator.EQUAL, key, value),
    neq: (value: string) => new Rule(RuleOperator.NOT_EQUAL, key, value),
    startsWith: (value: string) => new Rule(RuleOperator.STARTS_WITH, key, value),
    endsWith: (value: string) => new Rule(RuleOperator.ENDS_WITH, key, value),
    contains: (value: string) => new Rule(RuleOperator.CONTAINS, key, value),
  };
};

export function parseTagRule(tag = ""): TagNode | null {
  const chars = tag.split("");

  const nextToken = (): string => {
    const tok: string[] = [];

    const quotedToken = () => {
      const tok: string[] = [];

      while (chars.length) {
        let c = chars[0];

        if (!c) {
          break;
        }

        if (c === '"') {
          chars.shift();
          break;
        }

        if (c === "\\") {
          chars.shift();
          c = chars[0];
        }

        tok.push(c);
        chars.shift();
      }

      return tok.join("");
    };

    while (chars.length) {
      const c = chars[0];

      if (!c) {
        break;
      }

      if (c === "(" || c === ")") {
        tok.push(c);
        chars.shift();
        break;
      }

      if (c === " ") {
        chars.shift();
        // 前忽略
        if (tok.length === 0) {
          continue;
        }
        break;
      }

      if (c === '"') {
        chars.shift();
        return quotedToken();
      }

      tok.push(c);
      chars.shift();
    }

    return tok.join("");
  };

  const scanNode = (sub: boolean) => {
    let node: any = null;
    let rule: Rule | null = null;

    const putNode = (nextNode: TagNode) => {
      if (node instanceof Condition) {
        node.right = nextNode;
      } else {
        node = nextNode;
      }
    };

    const putRule = (tok: string) => {
      if (!rule) {
        rule = new Rule(RuleOperator.EXISTS, tok);
        putNode(rule);
      } else {
        rule.operator = tok as RuleOperator;
        rule.value = nextToken();
        rule = null;
      }
    };

    while (chars.length) {
      const tok = nextToken();

      if (tok === ")") {
        if (sub) {
          break;
        } else {
          continue;
        }
      }

      if (tok === "(" || tok === "&" || tok === "|") {
        rule = null; // clear rule

        switch (tok) {
          case "&":
            node = new Condition(ConditionOperator.AND, node);
            break;
          case "|":
            node = new Condition(ConditionOperator.OR, node);
            break;
          case "(":
            putNode(scanNode(true));
        }

        continue;
      }

      putRule(tok);
    }

    return node;
  };

  return scanNode(false);
}
