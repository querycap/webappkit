import { roundedEm, select } from "@querycap-ui/core";
import { theme } from "@querycap-ui/core";
import { must } from "@querycap/reactutils";
import { useObservable } from "@reactorx/core";
import { Dictionary, noop } from "@querycap/lodash";
import { useRef } from "react";
import { isUndefined } from "@querycap/lodash";
import { FilterMeta, FilterMetaBuilder, useNewSearchBox, useSearchBox } from "./search-box";
import { SearchInputContainer } from "./search-inputs";
import { SearchInputSort } from "./search-inputs/SearchInputSort";

export const MaybeSortable = must(() => {
  const { sortByMeta } = useSearchBox();
  return [sortByMeta] as const;
})(() => {
  const { sortBy$, sortByMeta, addFilter } = useSearchBox();

  const sortBy = useObservable(sortBy$);

  const Input = sortByMeta.type || SearchInputSort;

  if (!Input) {
    return null;
  }

  return (
    <Input
      {...sortByMeta}
      defaultValue={sortBy}
      onCancel={noop}
      onSubmit={(sortBy: string) => {
        addFilter(sortByMeta.key, sortBy);
      }}
    />
  );
});

export const displayFromOpts = (opts: any) => (v: string) => {
  return opts[v] || v;
};

export const createSearchBox = <TFilters extends Dictionary<any>>(filterMetaBuilders: {
  [k in keyof TFilters]: FilterMetaBuilder;
}) => {
  const defaultFilters = {} as any;
  const filterLabels: { [k: string]: string } = {};
  const filterMetas: { [k: string]: FilterMeta } = {};

  const sortables: string[] = [];

  for (const key in filterMetaBuilders) {
    const filterMeta = filterMetaBuilders[key]();

    if (filterMeta.sortable) {
      sortables.push(key);
    }

    if (!isUndefined(filterMeta.defaultValue)) {
      defaultFilters[key] = filterMeta.defaultValue;
    }

    filterLabels[key] = filterMeta.label || key;

    filterMetas[key] = {
      ...filterMeta,
      key,
      label: filterLabels[key],
      display: filterMeta.display || (filterMeta.type && (filterMeta.type as any).display),
    };
  }

  if (sortables.length > 0) {
    filterMetas["sort"] = {
      ...(filterMetas["sort"] || {}),
      key: "sort",
      enum: sortables,
      display: displayFromOpts(filterLabels),
    };
  }

  function SearchBoxContainer(props: { filters?: TFilters; onSubmit: (filters: TFilters) => void }) {
    const { onSubmit, filters } = props;

    const containerElmRef = useRef<HTMLDivElement>(null);

    const [, SearchBox] = useNewSearchBox(
      {
        ...defaultFilters,
        ...filters,
      },
      {
        filterMetas,
        onSubmit,
      },
    );

    return (
      <SearchBox>
        <div ref={containerElmRef}>
          <label
            css={select()
              .lineHeight(theme.lineHeights.normal)
              .borderWidth(1)
              .borderStyle("solid")
              .boxSizing("border-box")
              .fontSize(theme.state.fontSize)
              .fontFamily("inherit")
              .verticalAlign("baseline")
              .borderRadius(theme.radii.s)
              .appearance("none")
              .textDecoration("none")
              .display("flex")
              .alignItems("center")
              .borderColor(theme.state.borderColor)
              .colorFill(theme.state.color)
              .backgroundColor(theme.state.backgroundColor)
              .with(
                select("& [role=input]", "& input", "& textarea")
                  .flex(1)
                  .outline(0)
                  .width("100%")
                  .maxWidth("100%")
                  .background("none")
                  .lineHeight("inherit")
                  .border("none")
                  .colorFill("inherit")
                  .paddingX(roundedEm(0.2)),
              )}
          >
            <SearchInputContainer />
            <MaybeSortable />
          </label>
        </div>
      </SearchBox>
    );
  }

  SearchBoxContainer.defaultFilters = defaultFilters as TFilters;
  SearchBoxContainer.labels = filterLabels;

  return SearchBoxContainer as typeof SearchBoxContainer & {
    defaultFilters: TFilters;
    labels: typeof filterLabels;
  };
};
