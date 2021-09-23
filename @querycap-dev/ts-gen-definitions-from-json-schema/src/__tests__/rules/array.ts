export const cases = [
  {
    schema: {
      type: "array",
      items: {
        type: "string",
      },
    },
    result: "string[]",
  },
  {
    schema: {
      items: {
        type: "integer",
      },
    },
    result: "number[]",
  },
  {
    schema: {
      items: {
        type: "object",
        properties: {
          a: {
            type: "string",
          },
        },
      },
    },
    result: `Array<{
  a?: string;
}>`,
  },
  {
    schema: {
      items: [{ type: "string" }, { type: "integer" }],
      additionalItems: false,
    },
    result: "[string, number]",
  },
  {
    schema: {
      items: [{ type: "string" }, { type: "integer" }],
      additionalItems: true,
    },
    result: "[string, number, ...any[]]",
  },
  {
    schema: {
      items: [{ type: "string" }, { type: "integer" }],
      additionalItems: {
        type: "string",
      },
    },
    result: "[string, number, ...string[]]",
  },
  {
    schema: {
      items: {
        type: "string",
      },
      minItems: 2,
      maxItems: 2,
    },
    result: "[string, string]",
  },
];
