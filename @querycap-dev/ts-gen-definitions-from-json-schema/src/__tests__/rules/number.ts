export const cases = [
  {
    schema: {
      type: "number",
    },
    result: "number",
  },
  {
    schema: {
      type: "integer",
    },
    result: "number",
  },
  {
    schema: {
      maximum: 1,
    },
    result: "number",
  },
  {
    schema: {
      minimum: 1,
    },
    result: "number",
  },
];
