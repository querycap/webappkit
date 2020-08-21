import { theme, ThemeState, roundedEm } from "@querycap-ui/core/macro";
import { Stack } from "@querycap-ui/layouts";
import {
  createSearchBox,
  createTimeRangeDisplay,
  searchInput,
  SearchInputSelect,
  SearchInputTag,
  SearchInputTimeRange,
} from "@querycap-ui/search-controls";
import { formatRFC3339 } from "date-fns";
import React, { useState } from "react";

const SearchBox = createSearchBox<any>({
  name: searchInput().label("名称").wildcard(),
  keyword: searchInput().label("关键字"),
  type: searchInput(SearchInputSelect).enum(["A", "B", "C", "D"]).multiple(),
  tag: searchInput(SearchInputTag).label("标签").sortable(),
  createdAt: searchInput((props) => <SearchInputTimeRange {...props} maxValue={formatRFC3339(Date.now())} />)
    .label("日期")
    .sortable()
    .display(createTimeRangeDisplay("yyyy-MM-dd")),
  sort: searchInput().defaultValue("createdAt"),
});

export const SearchBoxDemo = () => {
  const [filters, setFilters] = useState({
    type: "A",
    tag: "id = 1",
    createdAt: "",
  });

  return (
    <Stack spacing={roundedEm(0.6)}>
      <ThemeState fontSize={theme.fontSizes.xs}>
        <SearchBox filters={filters} onSubmit={setFilters} />
        <div>{JSON.stringify(filters, null, 2)}</div>
      </ThemeState>

      <ThemeState fontSize={theme.fontSizes.s}>
        <SearchBox filters={filters} onSubmit={setFilters} />
        <div>{JSON.stringify(filters, null, 2)}</div>
      </ThemeState>
    </Stack>
  );
};
