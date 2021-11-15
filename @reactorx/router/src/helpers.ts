import { forEach, isArray, isObject, isUndefined } from "lodash";

export const toSearchString = (query: any) => {
  const searchParams = new URLSearchParams();

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
    searchParams.append(k, `${v}`);
  };

  forEach(query, (v, k) => {
    append(k, v);
  });

  const s = searchParams.toString();
  return s ? `?${s}` : "";
};

export function parseSearchString<T extends { [k: string]: string[] }>(search: string): T {
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
