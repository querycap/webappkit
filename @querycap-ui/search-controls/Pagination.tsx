import { preventDefault, roundedEm, select, theme } from "@querycap-ui/core/macro";
import { Stack } from "@querycap-ui/layouts";
import { times } from "lodash";
import { memo, ReactNode } from "react";
import { pipe } from "rxjs";

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

const NavBtn = ({
  children,
  disabled,
  onRequestNav,
}: {
  children?: ReactNode;
  disabled?: boolean;
  onRequestNav: () => void;
}) => (
  <a
    role={"nav"}
    href={"#"}
    data-disabled={disabled}
    onClick={pipe(preventDefault, () => {
      if (!disabled) {
        onRequestNav();
      }
    })}
  >
    {children}
  </a>
);

const Options = memo(({ value }: { value: number }) => (
  <>
    {times(value).map((_, i) => (
      <option key={i + 1} value={i + 1}>
        {i + 1}
      </option>
    ))}
  </>
));

export const Pagination = ({ total, pager, onPagerChange, onShowSizeChange, ...otherProps }: PaginationProps) => {
  const { size = 10, offset = 0 } = pager;
  const totalPage = Math.ceil(total / size);
  const currentPage = Math.floor(offset / size) + 1;

  const updatePage = (nextPage: number) => {
    onPagerChange({
      offset: (nextPage - 1) * size,
      size,
    });
  };

  return (
    <div css={select().fontSize(theme.state.fontSize).marginY(roundedEm(1))} {...otherProps}>
      <Stack
        inline
        spacing={roundedEm(0.6)}
        wrap={"wrap"}
        css={select("& > *")
          .textDecoration("none")
          .borderRadius(theme.radii.s)
          .whiteSpace("nowrap")
          .with(select("&[data-disabled=true]").opacity(0.5).colorFill(theme.state.color).cursor("not-allowed"))}
      >
        <NavBtn
          disabled={currentPage === 1}
          onRequestNav={() => {
            updatePage(currentPage - 1);
          }}
        >
          上页
        </NavBtn>
        <div>
          <select
            css={select()
              .borderRadius(theme.radii.s)
              .borderWidth(1)
              .outline("none")
              .borderColor(theme.state.borderColor)}
            value={currentPage}
            onChange={pipe(preventDefault, (e) => {
              updatePage(Number((e as any).target?.value));
            })}
          >
            <Options value={totalPage} />
          </select>
          &nbsp;/&nbsp;{totalPage}
        </div>
        <NavBtn
          disabled={currentPage === totalPage}
          onRequestNav={() => {
            updatePage(currentPage + 1);
          }}
        >
          下页
        </NavBtn>
        <div>共 {total} 条</div>
      </Stack>
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
