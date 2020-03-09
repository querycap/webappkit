import { RequestActor } from "@querycap/request";
import { useObservableEffect, useSelector } from "@reactorx/core";
import { useRequest } from "@reactorx/request";
import { parseSearchString, toSearchString, useRouter } from "@reactorx/router";
import { Dictionary, isEqual, isUndefined, mapKeys, omit, omitBy, pick, pickBy, snakeCase, startsWith } from "lodash";
import React, { ReactNode, useEffect, useMemo } from "react";
import { Observable } from "rxjs";
import { distinctUntilChanged, map as rxMap, tap } from "rxjs/operators";
import { IPager, ISearchState, SearchContextProvider, useSearch, useSearchContext } from "./SearchContext";

export function useNewSearch<TFilters extends Dictionary<any>, T>(
  name: string,
  query = {} as TFilters & Omit<IPager, "total">,
  syncFromURL?: boolean,
) {
  const { location } = useRouter();

  const ctx = useSearchContext<TFilters, T>(
    name,
    {
      filters: {
        ...omit(query, ["size", "offset"]),
      },
      pager: {
        ...pick(query, ["size", "offset"]),
      },
      data: [],
    },
    syncFromURL ? location.search : "",
  );

  const Search = useMemo(() => {
    return function Search({ children }: { children: ReactNode }) {
      return (
        <SearchContextProvider value={{ search: ctx }} key={name}>
          <SearchInit />
          {syncFromURL && <SyncToURL key={name} name={name} />}
          {children}
        </SearchContextProvider>
      );
    };
  }, [ctx]);

  return [ctx, Search] as const;
}

export const queryFromState = (state: ISearchState) =>
  omitBy(
    {
      ...state.filters,
      ...omit(state.pager, "total"),
    },
    (v) => isUndefined(v),
  );

function SyncToURL({ name }: { name: string }) {
  const ctx = useSearch() as ReturnType<typeof useSearchContext>;
  const { history } = useRouter();

  const nextQuery = useSelector(ctx.state$, queryFromState);

  const navWithQuery = (query: any = {}) => {
    const others = pickBy(parseSearchString(history.location.search), (_, k) => !startsWith(k, `${name}.`));

    history.replace({
      ...history.location,
      search: toSearchString({
        ...others,
        ...mapKeys(query, (_, k) => `${name}.${k}`),
      }),
    });
  };

  useEffect(() => {
    navWithQuery(nextQuery);
  }, [nextQuery]);

  useEffect(() => {
    return () => {
      navWithQuery({});
    };
  }, []);

  return null;
}

function SearchInit() {
  const ctx = useSearch() as ReturnType<typeof useSearchContext>;

  useEffect(() => {
    ctx.initial();

    return () => {
      ctx.destroy();
    };
  }, []);

  return null;
}

export function useSearchQuerySelector<TFilter>(state$: Observable<ISearchState<TFilter, any>>, deps: any[] = []) {
  return useSelector(
    state$,
    (state): TFilter & Omit<IPager, "total"> => ({
      ...state.filters,
      ...omit(state.pager, "total"),
    }),
    deps,
  );
}

export function useNewSearchOfRequest<TRequestActor extends RequestActor, TFilters = TRequestActor["arg"]>(
  requestActor: TRequestActor,
  defaultFilters: TFilters,
  {
    size,
    offset,
    name,
    syncURL,
    queryToArg = (filters, pager) => ({
      ...filters,
      ...pager,
    }),
  }: {
    size?: number;
    offset?: number;
    name?: string;
    syncURL?: boolean;
    queryToArg?: (filters: TFilters, pager: Omit<IPager, "total">) => TRequestActor["arg"];
  } = {} as any,
) {
  const [ctx, Search] = useNewSearch<TFilters, TRequestActor["done"]["arg"]["data"]["data"][0]>(
    snakeCase(name || requestActor.name),
    {
      size,
      offset,
      ...defaultFilters,
    } as any,
    syncURL,
  );

  const [request, requesting$] = useRequest(requestActor, {
    onSuccess: (actor) => {
      const resp = actor.arg.data;
      ctx.setData(resp.data, resp.total);
    },
  });

  const fetch = useMemo(() => {
    return (query: TRequestActor["arg"] = queryFromState((ctx.state$ as any).value)) => {
      const filters = omit(query, ["size", "offset"]);
      const pager = pick(query, ["size", "offset"]);
      return request(queryToArg(filters as any, pager));
    };
  }, [ctx]);

  useObservableEffect(() => {
    return ctx.state$.pipe(
      rxMap(queryFromState),
      distinctUntilChanged(isEqual),
      tap((query) => {
        fetch(query);
      }),
    );
  }, [ctx]);

  return [ctx, Search, fetch, requesting$] as const;
}
