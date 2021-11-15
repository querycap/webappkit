import { RequestActor } from "@querycap/request";
import { useObservableEffect, useSelector } from "@reactorx/core";
import { useRequest } from "@reactorx/request";
import { parseSearchString, toSearchString, useLocation, useNavigate, useRouter } from "@reactorx/router";
import { Dictionary, isEqual, isUndefined, mapKeys, omit, omitBy, pick, pickBy, snakeCase, startsWith } from "lodash";
import { ReactNode, useEffect, useMemo } from "react";
import { Observable } from "rxjs";
import { distinctUntilChanged, map as rxMap, tap } from "rxjs/operators";
import { SearchProvider, useSearch, useSearchContext } from "./SearchContext";
import { Pager, SearchState } from "./SearchStore";

const SearchInit = () => {
  const ctx = useSearch() as ReturnType<typeof useSearchContext>;

  useEffect(() => {
    ctx.initial();

    return () => {
      ctx.destroy();
    };
  }, []);

  return null;
};

export const queryFromState = (state: SearchState) =>
  omitBy(
    {
      ...state.filters,
      ...omit(state.pager, "total"),
    },
    (v) => isUndefined(v),
  );

function SyncToURL({ name }: { name: string }) {
  const ctx = useSearch() as ReturnType<typeof useSearchContext>;
  const location = useLocation();
  const navigate = useNavigate();

  const nextQuery = useSelector(ctx.state$, queryFromState);

  const navWithQuery = (query: any = {}) => {
    const others = pickBy(parseSearchString(location.search), (_, k) => !startsWith(k, `${name}.`));

    navigate(
      {
        search: toSearchString({
          ...others,
          ...mapKeys(query, (_, k) => `${name}.${k}`),
        }),
      },
      { replace: true },
    );
  };

  useEffect(() => {
    navWithQuery(nextQuery);
  }, [nextQuery]);

  return null;
}

export const useSearchQuerySelector = <TFilter extends {}>(
  state$: Observable<SearchState<TFilter, any>>,
  deps: any[] = [],
) =>
  useSelector(
    state$,
    (state): TFilter & Omit<Pager, "total"> => ({
      ...state.filters,
      ...omit(state.pager, "total"),
    }),
    deps,
  );

export const useNewSearch = <TFilters extends Dictionary<any>, T>(
  name: string,
  query = {} as TFilters & Omit<Pager, "total">,
  syncFromURL?: boolean,
) => {
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
        <SearchProvider value={{ search: ctx }} key={name}>
          <SearchInit />
          {syncFromURL && <SyncToURL key={name} name={name} />}
          {children}
        </SearchProvider>
      );
    };
  }, [ctx]);

  return [ctx, Search] as const;
};

export const useNewSearchOfRequest = <TRequestActor extends RequestActor, TFilters = TRequestActor["arg"]>(
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
    queryToArg?: (filters: TFilters, pager: Omit<Pager, "total">) => TRequestActor["arg"];
  } = {} as any,
) => {
  const [ctx, Search] = useNewSearch<TFilters, TRequestActor["done"]["arg"]["data"]["data"][0]>(
    snakeCase(name || requestActor.name),
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      ctx.setData(resp.data, resp.total);
    },
  });

  const fetch = useMemo(() => {
    return (query: TRequestActor["arg"] = queryFromState(ctx.state$.value)) => {
      const filters = omit(query, ["size", "offset"]);
      const pager = pick(query, ["size", "offset"]);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return request(queryToArg(filters as any, pager));
    };
  }, [ctx]);

  useObservableEffect(() => {
    return ctx.state$.pipe(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      rxMap(queryFromState),
      distinctUntilChanged(isEqual),
      tap((query) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        fetch(query);
      }),
    );
  }, [ctx]);

  return [ctx, Search, fetch, requesting$] as const;
};
