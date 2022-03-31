import { forEach, isArray, isObject, isUndefined } from "@querycap/lodash";

export const searchStringify = (query: { [k: string]: any }) => {
  const params = new URLSearchParams();

  const append = (k: string, v: any) => {
    if (isArray(v)) {
      forEach(v, (vv) => {
        append(k, vv);
      });
      return;
    }
    if (isObject(v)) {
      append(k, JSON.stringify(v));
      return;
    }
    if (isUndefined(v) || `${v}`.length == 0) {
      return;
    }
    params.append(k, `${v}`);
  };

  forEach(query, (v, k) => {
    append(k, v);
  });

  const s = params.toString();
  return s ? `?${s}` : "";
};

// @deprecated use searchStringify instead
export const toSearchString = (query: { [k: string]: any }) => {
  return searchStringify(query);
};

export function parseSearchString<T extends { [k: string]: string | string[] }>(search: string): T {
  if (search.startsWith("?")) {
    search = search.slice(1);
  }

  const searchParams = new URLSearchParams(search);
  const o: { [k: string]: string | string[] } = {};

  searchParams.forEach((_, k) => {
    o[k] = searchParams.getAll(k);
    if (o[k].length == 1) {
      o[k] = o[k][0];
    }
  });

  return o as any;
}
