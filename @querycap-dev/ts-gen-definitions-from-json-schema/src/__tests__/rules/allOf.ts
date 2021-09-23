export const cases = [
  {
    schema: {
      allOf: [{ type: "string" }, { type: "boolean" }],
    },
    result: "string & boolean",
  },
  {
    schema: {
      type: "object",
      properties: {
        accountType: {
          allOf: [
            {
              type: "string",
            },
            {
              description: "111",
            },
          ],
        },
      },
      required: ["accountType"],
    },
    result: `{
  accountType: string;
}`,
  },
];
