import { getBaseDir } from "../utils";

test("#getBaseDir, by output.path", () => {
  expect(getBaseDir("/a/b/c")).toBe("/a/b/c");
});

test("#getBaseDir, by output.path and output.publicPath", () => {
  expect(getBaseDir("/a/b/c", "/c/")).toBe("/a/b");
  expect(getBaseDir("/a/b/c", "/b/c/")).toBe("/a");
});
