export const cases = [
  {
    schema: {
      anyOf: [{ type: "string" }, { type: "boolean" }],
    },
    result: "string | boolean",
  },
];
