import { roundedEm, select, theme, transparentize } from "@querycap-ui/core/macro";
import { useObservable } from "@reactorx/core";
import { filter, flow, map, size } from "lodash";
import React from "react";
import { displayValue, FilterMeta, filterValueID, useSearchBox } from "../search-box";
import { SearchInputText } from "./SearchInputText";
import { SearchInputWild } from "./SearchInputWild";
import { CloseBtn } from "./utils";

const ClearBtn = () => {
  const { filters$, wildSearchInput$, clearAllFilter } = useSearchBox();

  const wildSearchInput = useObservable(wildSearchInput$);
  const filterValues = useObservable(filters$);

  if (size(filterValues) == 0 && !wildSearchInput) {
    return null;
  }

  return (
    <div css={select().display("flex").alignItems("center").paddingX("0.5em")}>
      <CloseBtn
        onClick={() => {
          clearAllFilter();
        }}
      />
    </div>
  );
};

const FilterInput = () => {
  const { focusedFilter$, filters$, focusFilter, putOrFocusFilter } = useSearchBox();

  const focusedFilter = useObservable(focusedFilter$);

  if (focusedFilter) {
    const Input = focusedFilter.type! || SearchInputText;

    return (
      <div
        css={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          "& > *:last-child": {
            flex: 1,
          },
        }}>
        <FilterLabel filterMeta={focusedFilter} />
        <Input
          {...focusedFilter}
          usedValues={map(
            filter(filters$.value, ({ key }) => focusedFilter.key === key),
            ({ value }) => value,
          )}
          onCancel={() => {
            focusFilter(null);
          }}
          onSubmit={(v) => {
            putOrFocusFilter(v);
          }}
        />
      </div>
    );
  }

  return <SearchInputWild />;
};

const FilterLabel = ({
  filterMeta,
  value,
  onNameClick,
  onRemoveClick,
}: {
  filterMeta: FilterMeta;
  value?: string;
  onNameClick?: (filterMeta: FilterMeta) => void;
  onRemoveClick?: (key: string, value: string) => void;
}) => {
  if (!filterMeta) {
    return null;
  }

  return (
    <div
      css={select()
        .display("flex")
        .alignItems("stretch")
        .color(flow(theme.state.color, transparentize(0.05)))
        .borderRadius(theme.radii.s)
        .backgroundColor(flow(theme.state.color, transparentize(0.96)))
        .with(select("& > *").paddingY(flow(theme.state.fontSize, roundedEm(0.25))))}>
      <div
        css={select()
          .display("flex")
          .alignItems("center")
          .borderLeftRadius(theme.radii.s)
          .backgroundColor(flow(theme.state.color, transparentize(0.96)))
          .color(flow(theme.state.color, transparentize(0.4)))
          .with(onNameClick && select().cursor("pointer"))}
        onClick={() => {
          onNameClick &&
            onNameClick({
              ...filterMeta,
              defaultValue: value,
            });
        }}>
        <span css={select().display("block").paddingX("0.3em")}>{filterMeta.label}</span>
      </div>
      {value && (
        <div>
          <span css={select().display("block").paddingX("0.3em")}>{displayValue(value, filterMeta.display)}</span>
        </div>
      )}
      {value && <CloseBtn onClick={() => onRemoveClick && onRemoveClick(filterMeta.key, value)} />}
    </div>
  );
};

const FilterLabelList = () => {
  const { filters$, filterMetas, focusFilter, delFilter } = useSearchBox();

  const filterValues = useObservable(filters$);

  return (
    <>
      {map(filterValues, ({ value, key }) => (
        <FilterLabel
          key={filterValueID({ key, value })}
          filterMeta={filterMetas[key]}
          value={value}
          onNameClick={(filterMeta) => {
            delFilter(key, value);
            focusFilter(filterMeta);
          }}
          onRemoveClick={(key: string, value: string) => {
            delFilter(key, value);
          }}
        />
      ))}
    </>
  );
};

export const SearchInputContainer = (_: {}) => {
  return (
    <>
      <div
        css={select()
          .flex(1)
          .display("flex")
          .alignItems("center")
          .flexWrap("wrap")
          .paddingX("0.4em")
          .lineHeight(theme.lineHeights.condensed)
          .with(select("& input").width("100%").paddingX(theme.space.s1))
          .margin(-2)
          .with(select("& > *").margin(2))}>
        <FilterLabelList />
        <div css={select().flex(1).with("& input").paddingX(0)}>
          <FilterInput />
        </div>
      </div>
      <ClearBtn />
    </>
  );
};
