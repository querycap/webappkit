import { ISchemaBasic } from "../Schema";
import { scan, Scanner } from "../Scanner";
import { writerOf } from "@querycap-dev/ts-gen-core";
import { forEach } from "@querycap/lodash";

export interface ICase {
  schema: ISchemaBasic;
  result: string;
}

const rules = {
  allOf: await import("./rules/allOf"),
  any: await import("./rules/any"),
  anyOf: await import("./rules/anyOf"),
  array: await import("./rules/array"),
  boolean: await import("./rules/boolean"),
  enum: await import("./rules/enum"),
  null: await import("./rules/null"),
  number: await import("./rules/number"),
  object: await import("./rules/object"),
  ref: await import("./rules/ref"),
  string: await import("./rules/string"),
};

describe("TypeBuilder#toType", () => {
  forEach(rules, ({ cases }, filename) => {
    forEach(cases, (caseItem, idx) => {
      test(`${filename} ${idx}`, () => {
        const writer = writerOf();
        scan(writer, {
          ...caseItem.schema,
          $id: "Test",
        });
        expect(String(new Scanner(writer).toType(caseItem.schema))).toEqual(caseItem.result);
      });
    });
  });
});

test("simple builder", () => {
  const writer = writerOf();

  scan(writer, {
    $schema: "https://json-schema.org/draft/2019-09/schema",
    $id: "https://json-schema.org/draft/2019-09/output/schema",
    description: "A schema that validates the minimum requirements for validation output",

    oneOf: [
      { $ref: "#/$defs/flag" },
      { $ref: "#/$defs/basic" },
      { $ref: "#/$defs/detailed" },
      { $ref: "#/$defs/verbose" },
    ],
    $defs: {
      outputUnit: {
        properties: {
          valid: { type: "boolean" },
          keywordLocation: {
            type: "string",
            format: "uri-reference",
          },
          absoluteKeywordLocation: {
            type: "string",
            format: "uri",
          },
          instanceLocation: {
            type: "string",
            format: "uri-reference",
          },
          errors: {
            $ref: "#/$defs/outputUnitArray",
          },
          annotations: {
            $ref: "#/$defs/outputUnitArray",
          },
        },
        required: ["valid", "keywordLocation", "instanceLocation"],
        allOf: [
          {
            if: {
              properties: {
                valid: { const: false },
              },
            },
            then: {
              required: ["errors"],
            },
          },
          {
            if: {
              oneOf: [
                {
                  properties: {
                    keywordLocation: {
                      pattern: ".*/$ref/.*",
                    },
                  },
                },
                {
                  properties: {
                    keywordLocation: {
                      pattern: ".*/$recursiveRef/.*",
                    },
                  },
                },
              ],
            },
            then: {
              required: ["absoluteKeywordLocation"],
            },
          },
        ],
      },
      outputUnitArray: {
        type: "array",
        items: { $ref: "#/$defs/outputUnit" },
      },
      flag: {
        properties: {
          valid: { type: "boolean" },
        },
        required: ["valid"],
      },
      basic: { $ref: "#/outputUnit" },
      detailed: { $ref: "#/outputUnit" },
      verbose: { $ref: "#/outputUnit" },
    },
  });

  console.log(writer.output());
});
