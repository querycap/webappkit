import { Dictionary, map, trim } from "lodash";

export class TokenSet {
  static parse(s = ""): TokenSet {
    const tokens: Dictionary<string> = {};

    String(s)
      .split(";")
      .forEach((token) => {
        const kv = token.split(" ");
        if (kv[0].length > 0 && kv[1]) {
          tokens[trim(kv[0].toLowerCase())] = kv[1];
        }
      });

    return new TokenSet(tokens);
  }

  constructor(private tokens: Dictionary<string> = {}) {}

  get(key = ""): string {
    return this.tokens[key.toLowerCase()];
  }

  with(key: string, value = "") {
    return new TokenSet({
      ...this.tokens,
      [key.toLowerCase()]: value,
    });
  }

  toString() {
    return map(this.tokens, (v, key) => `${key} ${v}`).join(";");
  }
}
