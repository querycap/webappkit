import * as lodash from "lodash";
import { ISchemaBasic } from "../Schema";
import { scan, Scanner } from "../Scanner";
import { writerOf } from "@querycap-dev/ts-gen-core";

export interface ICase {
  schema: ISchemaBasic;
  result: string;
}

const rules = {
  allOf: require("./rules/allOf"),
  any: require("./rules/any"),
  anyOf: require("./rules/anyOf"),
  array: require("./rules/array"),
  boolean: require("./rules/boolean"),
  enum: require("./rules/enum"),
  null: require("./rules/null"),
  number: require("./rules/number"),
  object: require("./rules/object"),
  ref: require("./rules/ref"),
  string: require("./rules/string"),
};

describe("TypeBuilder#toType", () => {
  lodash.forEach(rules, ({ cases }, filename) => {
    lodash.forEach(cases, (caseItem: ICase, idx) => {
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
