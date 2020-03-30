import { useValueRef } from "@querycap/reactutils";
import { useObservableEffect } from "@reactorx/core";
import { concat, Dictionary, filter, find, forEach, isEqual, pickBy, split, trim, uniqBy, values } from "lodash";
import React, { createContext, FunctionComponent, ReactNode, useContext, useMemo } from "react";
import { BehaviorSubject, merge } from "rxjs";
import { distinctUntilChanged, tap } from "rxjs/operators";

export interface SearchInputProps {
  onCancel: () => void;
  onSubmit: (v: string) => void;
  usedValues?: string[];
  defaultValue?: string;
  enum?: string[];
  display?: (v: string) => ReactNode;
}

export type SearchInput = FunctionComponent<SearchInputProps>;

export const displayValue = (v: string, d?: (v: string) => ReactNode): ReactNode => {
  return d ? d(v) : v;
};

export interface FilterValue {
  key: string;
  value: string;
}

export interface FilterMeta {
  key: string;
  // 显示名称
  label?: string;
  // 多值
  multiple?: boolean;
  //
  target?: "wild" | "sort";

  defaultValue?: string;
  enum?: string[];

  display?: (v: string) => ReactNode;
  type?: SearchInput;
}

export type FilterMetaBuilder = {
  [k in keyof FilterMeta]-?: (arg: FilterMeta[k]) => FilterMetaBuilder;
} & {
  (): FilterMeta;
};

export const searchInput = (target?: "wild" | "sort") => {
  const filterMeta: any = {
    target: target,
  };

  const build = () => filterMeta;

  const builder = new Proxy(build, {
    get(_, prop) {
      return (v: any): any => {
        filterMeta[prop as any] = v;
        return builder;
      };
    },
  });

  return builder as FilterMetaBuilder;
};

export const filterValueID = (l: FilterValue) => `${l.key}=${l.value}`;

export const filterListToObject = (
  list: FilterValue[],
  filterMetas: Dictionary<FilterMeta>,
): Dictionary<undefined | string | string[]> => {
  const filters: Dictionary<string | string[]> = {};

  forEach(list, ({ key, value }) => {
    filters[key] = [...(filters[key] || []), value];
  });

  forEach(filterMetas, (_, key) => {
    if (!filters[key]) {
      filters[key] = undefined as any;
    }
  });

  return filters;
};

export const filterObjectToList = (o: Dictionary<string[]>, filterMetas: Dictionary<FilterMeta>): FilterValue[] => {
  const filterList: FilterValue[] = [];

  forEach(o, (values, key) => {
    if (filterMetas[key]) {
      forEach(([] as string[]).concat(values), (value) => {
        filterList.push({ key, value });
      });
    }
  });

  return filterList;
};

export const useSearchBoxMgr = (
  defaultFilters: any = {},
  {
    filterMetas = {},
    onSubmit,
  }: {
    filterMetas?: Dictionary<FilterMeta>;
    onSubmit?: (filters: any) => void;
  } = {},
) => {
  const onSubmitRef = useValueRef(onSubmit);

  const ctx = useMemo(() => {
    const wildSearchMeta = find(values(filterMetas), (v) => v.target === "wild") as FilterMeta;
    const sortByMeta = find(values(filterMetas), (v) => v.target === "sort") as FilterMeta;

    const submit$ = new BehaviorSubject({});
    const filters$ = new BehaviorSubject<FilterValue[]>(
      filterObjectToList(
        defaultFilters,
        pickBy(filterMetas, (m) => !m.target),
      ),
    );

    const wildSearch$ = new BehaviorSubject<string>(wildSearchMeta ? defaultFilters[wildSearchMeta.key] : "");
    const wildSearchInput$ = new BehaviorSubject<string>(wildSearch$.value);
    const sortBy$ = new BehaviorSubject<string>(sortByMeta ? defaultFilters[sortByMeta.key] : "");

    const focused$ = new BehaviorSubject<boolean>(false);
    const focusedFilter$ = new BehaviorSubject<FilterMeta | null>(null);

    const focusFilter = (filterMeta: FilterMeta | null) => {
      if (filterMeta?.target === "wild") {
        return;
      }
      focusedFilter$.next(filterMeta);
      focused$.next(true);
    };

    const putFilter = (key: string, value: string) => {
      const filterMeta = filterMetas[key];

      if (!filterMeta) {
        return;
      }

      switch (filterMeta.target) {
        case "sort":
          sortBy$.next(value);
          return;
        case "wild":
          wildSearch$.next(value);
          return;
      }

      if (!value) {
        return;
      }

      let filterValues = filters$.value;

      if (!filterMeta.multiple) {
        // omit same key
        filterValues = filter(filterValues, ({ key }) => key !== filterMeta.key);
      }

      filterValues = uniqBy(concat(filterValues, { key, value }), filterValueID);

      filters$.next(filterValues);

      focusFilter(null);
    };

    const delFilter = (key: string, value: string) => {
      const k = filterValueID({ key, value });

      filters$.next(filter(filters$.value, (f) => filterValueID(f) !== k));
    };

    const clearAllFilter = () => {
      filters$.next([]);

      wildSearch$.next("");
      wildSearchInput$.next("");
    };

    const putOrFocusFilter = (inputValue: string) => {
      const v = trim(inputValue);

      if (focusedFilter$.value) {
        if (v) {
          putFilter(focusedFilter$.value.key, v);
        }
        return;
      }

      let [keyOrValue, value] = split(v, ":");

      let matchedFilter = filterMetas[keyOrValue];

      if (!matchedFilter && wildSearchMeta) {
        matchedFilter = wildSearchMeta;
        value = keyOrValue;
        keyOrValue = matchedFilter.key;
      }

      if (matchedFilter) {
        const v = trim(value);

        if (matchedFilter.target === "wild") {
          putFilter(matchedFilter.key, v);
        } else {
          if (v) {
            putFilter(matchedFilter.key, v);
          } else {
            focusFilter(matchedFilter);
          }
        }
      }
    };

    return {
      submit$,
      wildSearch$,
      wildSearchInput$,
      sortBy$,
      filters$,

      focused$,

      focusedFilter$,

      focusFilter,
      addFilter: putFilter,

      delFilter,
      clearAllFilter,
      putOrFocusFilter,

      filterMetas,
      wildSearchMeta: wildSearchMeta,
      sortByMeta: sortByMeta,
    };
  }, []);

  useObservableEffect(() => {
    return [
      ctx.submit$.pipe(
        distinctUntilChanged(isEqual),
        tap((filterSet) => {
          if (onSubmitRef.current) {
            onSubmitRef.current(filterSet);
          }
        }),
      ),
      merge(ctx.wildSearch$, ctx.sortBy$, ctx.filters$).pipe(
        tap(() => {
          const filterSet = filterListToObject(ctx.filters$.value, ctx.filterMetas);

          if (ctx.wildSearchMeta) {
            filterSet[ctx.wildSearchMeta.key] = ctx.wildSearch$.value || undefined;
          }

          if (ctx.sortByMeta) {
            filterSet[ctx.sortByMeta.key] = ctx.sortBy$.value || undefined;
          }

          ctx.submit$.next(filterSet);
        }),
      ),
    ];
  }, []);

  return ctx;
};

const SelectBoxContext = createContext({} as { searchBox: ReturnType<typeof useSearchBoxMgr> });

const SelectBoxContextProvider = SelectBoxContext.Provider;

export const useSearchBox = () => useContext(SelectBoxContext).searchBox;

export const useNewSearchBox = (
  defaultFilters: any = {},
  opts: {
    filterMetas?: Dictionary<FilterMeta>;
    onSubmit?: (filters: any) => void;
  } = {},
) => {
  const ctx = useSearchBoxMgr(defaultFilters, opts);

  const SearchBox = useMemo(
    () => ({ children }: { children: ReactNode }) => (
      <SelectBoxContextProvider value={{ searchBox: ctx }}>{children}</SelectBoxContextProvider>
    ),
    [],
  );

  return [ctx, SearchBox] as const;
};
