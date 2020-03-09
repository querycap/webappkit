import { Actor, useStore, Volume } from "@reactorx/core";
import { parseSearchString } from "@reactorx/router";
import { Dictionary, mapKeys, omit, pick, pickBy, split, startsWith } from "lodash";
import { createContext, useContext, useMemo, Provider } from "react";
import { Observable } from "rxjs";

export interface IPager {
  offset: number;
  size: number;
  total?: number;
}

export interface ISearchState<TFilters = any, T = any> {
  filters: TFilters;
  pager: IPager;
  data: T[];
  searched?: boolean;
}

const SearchActor = Actor.of<any, { search: string }>("search");

export const searchKey = (searchID: string) => `${SearchActor.group}::${searchID}`;

const searchKeyFromActor = (actor: Actor<any, { search: string }>) => searchKey(actor.opts.search);

const initialSearch = SearchActor.named<ISearchState>("initial").effectOn(searchKeyFromActor, (_, { arg }) => arg);

const setSearchPager = SearchActor.named<{
  offset: number;
  size: number;
}>("set-pager").effectOn(searchKeyFromActor, (prevState: ISearchState = {} as any, { arg: { offset, size } }) => ({
  ...prevState,
  pager: {
    ...prevState.pager,
    offset,
    size,
  },
}));

const setSearchFilters = SearchActor.named<Dictionary<any>>("set-filters").effectOn(
  searchKeyFromActor,
  (prevState: ISearchState = {} as any, { arg }) => ({
    ...prevState,
    filters: {
      ...prevState.filters,
      ...arg,
    },
    pager: {
      ...prevState.pager,
      offset: 0,
    },
  }),
);

const setSearchData = SearchActor.named<{ data: any[]; total?: number }, { append?: boolean }>("set-data").effectOn(
  searchKeyFromActor,
  (prevState: ISearchState = {} as any, { arg, opts }) =>
    ({
      ...prevState,
      pager: {
        ...prevState.pager,
        total: arg.total,
      },
      data: opts.append ? [...prevState.data, ...arg.data] : arg.data,
      searched: true,
    } as any),
);

const destroySearch = SearchActor.named<void>("destroy").effectOn(searchKeyFromActor, () => undefined);

export interface ISearchContext<TFilters extends Dictionary<any>, T> {
  state$: Observable<ISearchState<TFilters, T>>;
  setPager: (pager: IPager) => void;
  setFilters: (filters: Partial<TFilters>) => void;
  setData: (data: T[], total?: number, append?: boolean) => void;
}

export type TSearchContext = {
  search?: ISearchContext<any, any>;
};

const SearchContext = createContext<TSearchContext>({});

export const SearchContextProvider: Provider<TSearchContext> = SearchContext.Provider;

export function useSearch<TFilters extends Dictionary<any>, T>() {
  return useContext(SearchContext).search! as ISearchContext<TFilters, T>;
}

const fromLocationSearch = (searchName: string, locationSearch: string) => {
  const query = mapKeys(
    pickBy(parseSearchString(locationSearch), (_, k) => startsWith(k, `${searchName}.`)),
    (_, k) =>
      split(k, ".")
        .slice(1)
        .join("."),
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

export const useSearchContext = <TFilters extends Dictionary<any>, T>(
  searchName: string,
  initialSearchState: ISearchState = defaultSearchState,
  locationSearch?: string,
) => {
  const store$ = useStore();

  return useMemo(() => {
    if (locationSearch) {
      const ls = fromLocationSearch(searchName, locationSearch);

      initialSearchState = {
        ...initialSearchState,
        filters: {
          ...initialSearchState.filters,
          ...ls.filters,
        },
        pager: {
          ...initialSearchState.pager,
          ...(ls.pager as any),
        },
      };
    }

    return {
      state$: Volume.from(
        store$,
        (state: any = {}): ISearchState<TFilters, T> => {
          return state[searchKey(searchName)] || initialSearchState;
        },
      ),
      initial: () => {
        initialSearch.with(initialSearchState, { search: searchName }).invoke(store$);
      },
      destroy: () => {
        destroySearch.with(undefined, { search: searchName }).invoke(store$);
      },
      setFilters: (filters: Partial<TFilters>) => {
        setSearchFilters.with(filters, { search: searchName }).invoke(store$);
      },
      setPager: (pager: IPager) => {
        setSearchPager.with(pager, { search: searchName }).invoke(store$);
      },
      setData: (data: T[], total?: number, append?: boolean) => {
        setSearchData.with({ data, total } as any, { append, search: searchName }).invoke(store$);
      },
    };
  }, [searchName]);
};
