import { createStore } from "@querycap/contexts";
import { Dictionary } from "lodash";

export interface Pager {
  offset: number;
  size: number;
  total?: number;
}

export interface SearchState<TFilters = any, TItem = any> {
  filters: TFilters;
  pager: Pager;
  data: TItem[];
  searched?: boolean;
}

export interface SearchOpt {
  search: string;
}

export const searchStore = createStore<SearchOpt, SearchState>({
  group: "search",
  initialState: {
    filters: {},
    pager: {
      size: 10,
      offset: 0,
    },
    data: [],
  },
  storageKey: ({ group, search }) => `${group}:${search}`,
})({
  initial: (arg: SearchState) => () => arg,
  destroy: () => () => undefined,
  setPager:
    ({ offset, size }: { offset: number; size: number }) =>
    (searchState) => ({
      ...searchState,
      pager: {
        ...searchState.pager,
        offset,
        size,
      },
    }),
  setFilters: (filters: Dictionary<any>) => (searchState) => ({
    ...searchState,
    filters: {
      ...searchState.filters,
      ...filters,
    },
    pager: {
      ...searchState.pager,
      offset: 0,
    },
  }),
  setData:
    (d: { data: any[]; total?: number }, { append }: { append?: boolean }) =>
    (searchState) => ({
      ...searchState,
      pager: {
        ...searchState.pager,
        total: d.total,
      },
      data: append ? [...(searchState.data || []), ...d.data] : d.data,
      searched: true,
    }),
});
