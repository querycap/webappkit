import { parse, stringify } from "querystring";

export const toSearchString = (query: any) => {
  const s = stringify(query);
  return s ? `?${stringify(query)}` : "";
};

export function parseSearchString<T extends ReturnType<typeof parse> = any>(search: string): T {
  if (search.startsWith("?")) {
    search = search.slice(1);
  }
  return parse(search) as any;
}
