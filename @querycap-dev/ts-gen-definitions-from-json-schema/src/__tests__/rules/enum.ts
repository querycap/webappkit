export const cases = [
  {
    schema: {
      enum: [1, 2, 3],
    },
    result: "1 | 2 | 3",
  },
  {
    schema: {
      enum: ["1", "2", "3"],
    },
    result: '"1" | "2" | "3"',
  },
];
