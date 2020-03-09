import { Dictionary, forEach, startsWith } from "lodash";

export const getProtocol = () => globalThis.location.protocol;

export const isHttps = () => getProtocol() == "https:";

export const protocolPrefix = (url = "") => {
  if (url.startsWith("http:") || url.startsWith("https:")) {
    url = url.replace(/https?:/, "");
  }
  return getProtocol() + url;
};

export const urlComplete = (baseURLs: Dictionary<string>) => (url = "/") => {
  if (url.startsWith("http:") || url.startsWith("https:")) {
    return url;
  }
  const firstPart = url.split("/")[1];
  return `${protocolPrefix(baseURLs[firstPart])}${url}`;
};

export const baseURLsFromConfig = (config: Dictionary<string>): Dictionary<string> => {
  const baseURLs: Dictionary<string> = {};

  forEach(config, (v, k) => {
    if (startsWith(k, "SRV_")) {
      const basePath = k
        .replace("SRV_", "")
        .replace(/_/g, "-")
        .toLowerCase();
      baseURLs[basePath] = v;
    }
  });

  return baseURLs;
};
