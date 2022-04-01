import path from "path";

export const getBaseDir = (pathString: string, publicPath?: string): string => {
  if (!publicPath || publicPath === "/") {
    return pathString;
  }

  const relativePath = path
    .resolve(publicPath)
    .split("/")
    .filter((item: string) => item.length)
    .map(() => "..")
    .join("/");

  return path.join(pathString, relativePath);
};
