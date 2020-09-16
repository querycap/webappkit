import { HMR_ENTRY, patchEntryWithHMR } from "../WebpackOptions";

test("#patchEntries, simple entry should be patched", () => {
  const entry = "a.js";

  expect(patchEntryWithHMR(entry)).toEqual([HMR_ENTRY, entry]);
});

test("#patchEntry, multi entries should be patched", () => {
  const entry = {
    a: "a.js",
    b: "b.js",
  };

  expect(patchEntryWithHMR(entry)).toEqual({
    a: [HMR_ENTRY, entry.a],
    b: [HMR_ENTRY, entry.b],
  });
});
