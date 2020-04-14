import { parseSearchString } from "@reactorx/router";
import { Dictionary, mapKeys, omit, pick, pickBy, split, startsWith } from "lodash";
import { createContext, useContext, useMemo } from "react";
import { Observable } from "rxjs";
import { Pager, SearchState, searchStore } from "./SearchStore";

export interface SearchContext<TFilters extends Dictionary<any>, T> {
  state$: Observable<SearchState<TFilters, T>>;
  setPager: (pager: Pager) => void;
  setFilters: (filters: Partial<TFilters>) => void;
  setData: (data: T[], total?: number, append?: boolean) => void;
}

const SearchContext = createContext<{
  search?: SearchContext<any, any>;
}>({});

export const SearchProvider = SearchContext.Provider;

export function useSearch<TFilters extends Dictionary<any>, T>() {
  return useContext(SearchContext).search! as SearchContext<TFilters, T>;
}

const fromLocationSearch = (searchName: string, locationSearch: string) => {
  const query = mapKeys(
    pickBy(parseSearchString(locationSearch), (_, k) => startsWith(k, `${searchName}.`)),
    (_, k) => split(k, ".").slice(1).join("."),
  );

  return {
    filters: omit(query, ["size", "offset"]),
    pager: pick(query, ["size", "offset"]),
  };
};

const defaultSearchState = {
  filters: {},
  pager: {
    size: 10,
    offset: 0,
  },
  data: [],
};

export const useSearchContext = <TFilters extends Dictionary<any>, TItem>(
  searchName: string,
  initialSearchState: SearchState = defaultSearchState,
  locationSearch?: string,
) => {
  const [state$, actions] = searchStore.useState({ search: searchName }, () => {
    if (locationSearch) {
      const ls = fromLocationSearch(searchName, locationSearch);

      return {
        ...initialSearchState,
        filters: {
          ...initialSearchState.filters,
          ...ls.filters,
        },
        pager: {
          ...initialSearchState.pager,
          ...(ls.pager as any),
        },
      } as SearchState<TFilters, TItem>;
    }

    return initialSearchState as SearchState<TFilters, TItem>;
  });

  return useMemo(() => {
    return {
      state$: state$,
      initial: () => actions.initial(state$.value),
      destroy: () => actions.destroy(undefined),
      setFilters: actions.setFilters,
      setPager: actions.setPager,
      setData: (data: TItem[], total?: number, append?: boolean) => {
        actions.setData({ data, total } as any, { append });
      },
    };
  }, [state$]);
};
