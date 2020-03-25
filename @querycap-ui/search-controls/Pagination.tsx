import { selector, themes, ThemeState } from "@querycap-ui/core";
import { map } from "lodash";
import React from "react";

export interface Pager {
  size: number;
  offset: number;
}

export interface PaginationProps {
  total: number;
  pager: Pager;
  onPagerChange: (nextPager: Pager) => void;
  pageSizeOptions?: Array<number>;
  onShowSizeChange?: (nextPager: Pager) => void;
}

export const getPageNums = (total: number, current: number, offset = 3): Array<number | null> => {
  const nums: Array<number | null> = [];

  let n = total + 1;

  while (n--) {
    if (n <= 0) {
      break;
    }

    if (n >= total - offset) {
      nums.push(n);
    } else if (n <= 1 + offset) {
      nums.push(n);
    } else if (n >= current - offset && n <= current + offset) {
      nums.push(n);
    } else if (n === current + offset + 1 || n === current - offset - 1) {
      nums.push(null);
    }
  }

  return nums.reverse();
};

export const Pagination = ({ total, pager, onPagerChange, onShowSizeChange, ...otherProps }: PaginationProps) => {
  const { size = 10, offset = 0 } = pager;
  const totalPage = Math.ceil(total / size);
  const currentPage = Math.floor(offset / size) + 1;

  const pageNums = getPageNums(totalPage, currentPage, 2);

  const updatePage = (nextPage: number) => {
    onPagerChange({
      offset: (nextPage - 1) * size,
      size,
    });
  };

  const itemStyle = selector()
    .textDecoration("none")
    .colorFill(themes.state.color)
    .backgroundColor(themes.state.backgroundColor)
    .paddingX("0.6em")
    .borderRadius(themes.radii.s)
    .paddingY((t) => Math.round(0.25 * t.state.fontSize));

  const pageNumItems = map(pageNums, (pageNum, idx) => {
    const active = currentPage === pageNum;

    return (
      <ThemeState backgroundColor={active ? themes.colors.primary : themes.state.backgroundColor} autoColor>
        <a
          href={"#"}
          key={idx}
          onClick={(e) => {
            e.preventDefault();
            !!pageNum && currentPage !== pageNum && updatePage(pageNum);
          }}
          css={itemStyle.cursor("pointer")}>
          {pageNum ? pageNum : "..."}
        </a>
      </ThemeState>
    );
  });

  return (
    <div
      css={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        width: "100%",
        margin: "2em 0",
      }}
      {...otherProps}>
      {pageNumItems.length > 0 && (
        <>
          {currentPage !== 1 && (
            <a
              css={itemStyle.marginRight("0.2em")}
              href={"#"}
              onClick={(e) => {
                e.preventDefault();
                updatePage(currentPage - 1);
              }}>
              上一页
            </a>
          )}
          <div css={itemStyle.marginRight("0.2em")}>{total} 条</div>
          <div css={{ "& > *": { margin: "0 0.2em" } }}>{pageNumItems}</div>
          {currentPage !== totalPage && (
            <a
              css={itemStyle}
              href={"#"}
              onClick={(e) => {
                e.preventDefault();
                updatePage(currentPage + 1);
              }}>
              下一页
            </a>
          )}
        </>
      )}
    </div>
  );
};

export interface PagerWithTotal extends Pager {
  total?: number;
}

export const PaginationWithTotal = ({
  pager,
  onPagerChange,
}: {
  pager: PagerWithTotal;
  onPagerChange: PaginationProps["onPagerChange"];
}) => <>{!!pager.total && <Pagination total={pager.total} pager={pager} onPagerChange={onPagerChange} />}</>;
