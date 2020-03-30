import { theme, ThemeState } from "@querycap-ui/core/macro";
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
  name: searchInput("wild").label("名称"),
  type: searchInput().type(SearchInputSelect).enum(["A", "B", "C", "D"]).multiple(true),
  tag: searchInput().type(SearchInputTag).label("tag"),
  createdAt: searchInput()
    .label("日期")
    .type((props) => <SearchInputTimeRange {...props} maxValue={formatRFC3339(Date.now())} />)
    .display(createTimeRangeDisplay("yyyy-MM-dd")),
  sort: searchInput("sort").enum(["createdAt", "type"]),
});

export const SearchBoxDemo = () => {
  const [filters, setFilters] = useState({
    type: "A",
    tag: "id = 1",
  });

  return (
    <Stack spacing={theme.space.s2}>
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
