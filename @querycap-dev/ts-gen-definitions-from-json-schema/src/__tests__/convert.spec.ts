import { ISchemaBasic, SimpleTypes } from "../Schema";
import { simplifySchema } from "../convert";

test("could replace imports schema with definitions", () => {
  const result = simplifySchema(
    {
      $ref: "otherSchema#/$defs/Test",
    },
    {
      otherSchema: {
        $defs: {
          Test: {
            type: SimpleTypes.string,
          },
        },
      },
    },
  );

  expect(result).toEqual({
    type: "string",
  } as ISchemaBasic);
});

test("could replace imports schema with deep path", () => {
  const result = simplifySchema(
    {
      $ref: "otherSchema#/properties/test",
    },
    {
      otherSchema: {
        type: "object",
        properties: {
          test: {
            $ref: "#/$defs/Test",
          },
        },
        $defs: {
          Test: {
            type: "string",
          },
        },
      },
    },
  );

  expect(result).toEqual({
    type: "string",
  } as ISchemaBasic);
});
