import { compile, Key, ParseOptions, pathToRegexp, TokensToRegexpOptions } from "path-to-regexp";
import { useEffect, useRef } from "react";

export interface IMatchPathOpt {
  path?: string | string[];
  exact?: boolean;
  strict?: boolean;
  sensitive?: boolean;
  end?: boolean;
}

export const createCompilePath = () => {
  const cache: { [key: string]: any } = {};
  const cacheLimit = 10000;
  let cacheCount = 0;

  return (path: string, options: TokensToRegexpOptions & ParseOptions) => {
    const cacheKey = `${options.end}${options.strict}${options.sensitive}`;
    const pathCache = cache[cacheKey] || (cache[cacheKey] = {});

    if (pathCache[path]) return pathCache[path];

    const keys: Key[] = [];
    const regexp = pathToRegexp(path, keys, options);
    const result = { regexp, keys };

    if (cacheCount < cacheLimit) {
      pathCache[path] = result;
      cacheCount++;
    }

    return result;
  };
};

export const compilePath = createCompilePath();

export interface IMatch<TParameters> {
  params: TParameters;
  isExact: boolean;
  path: string;
  url: string;
}

export function matchPath(pathname: string, optionsOrPath: IMatchPathOpt | string = ""): IMatch<any> | null {
  if (typeof optionsOrPath === "string") {
    optionsOrPath = { path: optionsOrPath };
  }

  const { path = "", exact = false, strict = false, sensitive = false } = optionsOrPath;

  const paths = ([] as string[]).concat(path);

  return paths.reduce((matched: IMatch<any> | null, path) => {
    if (matched) {
      return matched;
    }

    path = path.split("?")[0];

    const { regexp, keys } = compilePath(path, {
      end: exact,
      strict,
      sensitive,
    });

    const match = regexp.exec(pathname);

    if (!match) {
      return null;
    }

    const [url, ...values] = match;
    const isExact = pathname === url;

    if (exact && !isExact) {
      return null;
    }

    return {
      path, // the path used to match
      url: path === "/" && url === "" ? "/" : url, // the matched portion of the URL
      isExact, // whether or not we matched exactly
      params: keys.reduce((memo: { [key: string]: any }, key: Key, index: number) => {
        memo[key.name] = values[index];
        return memo;
      }, {}),
    };
  }, null);
}

const createCompileGenerator = () => {
  const patternCache: { [key: string]: any } = {};
  const cacheLimit = 10000;
  let cacheCount = 0;

  return (pattern: string) => {
    const cacheKey = pattern;
    const cache = patternCache[cacheKey] || (patternCache[cacheKey] = {});

    if (cache[pattern]) return cache[pattern];

    const compiledGenerator = compile(pattern, { encode: encodeURIComponent });

    if (cacheCount < cacheLimit) {
      cache[pattern] = compiledGenerator;
      cacheCount++;
    }

    return compiledGenerator;
  };
};

const compileGenerator = createCompileGenerator();

export const generatePath = (pattern = "/", params = {}): string => {
  if (pattern === "/") {
    return pattern;
  }

  const [path, search] = pattern.split("?");

  return `${compileGenerator(path)(params)}${search ? `?${search}` : ""}`;
};

export function usePrevious<T>(value: T) {
  const ref = useRef<T>(null);
  useEffect(() => {
    (ref.current as any) = value;
  });
  return ref.current;
}
