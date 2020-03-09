import { and, key, or, parseTagRule } from "../tag-rule";

describe("tag", () => {
  it("#toString()", () => {
    const tag = and(key("env").exists(), or(key("tag").eq("ONLINE"), key("tag").eq("some label")));

    expect(tag.toString()).toEqual(`env & (tag = "ONLINE" | tag = "some label")`);
  });

  it("#parse tag rule", () => {
    const r = parseTagRule('env & (tag = "ONLINE" | tag = "some lab\\"el") & ip != 1.1.1.1');

    expect(`${r}`).toEqual('(env & (tag = "ONLINE" | tag = "some lab\\"el")) & ip != "1.1.1.1"');
  });
});
