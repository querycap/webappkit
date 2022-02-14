import { preventDefault, roundedEm, select, theme, transparentize } from "@querycap-ui/core/macro";
import { IconChevronLeft, IconChevronRight } from '@querycap-ui/icons';
import { Stack } from "@querycap-ui/layouts";
import { flow, times } from "lodash";
import { createContext, memo, ReactNode, useContext } from "react";
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
    css={!disabled && select('&:hover').fill(t => t.colors.primary)}
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
          <IconChevronLeft />
        </NavBtn>
        <PaginationProvider value={{
          currentPage,
          totalPage,
          updatePage,
        }}>
          <PageItems />
        </PaginationProvider>
        <NavBtn
          disabled={currentPage === totalPage}
          onRequestNav={() => {
            updatePage(currentPage + 1);
          }}
        >
          <IconChevronRight />
        </NavBtn>
        {totalPage > 6 &&
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
        }
      </Stack>
    </div>
  );
};

interface IPaginationContext {
  currentPage: number,
  totalPage: number,
  updatePage: (num: number) => void,
}

const PaginationContext = createContext({} as IPaginationContext);
const PaginationProvider = PaginationContext.Provider;
const usePaginationInfo = () => useContext(PaginationContext)

const PageItems = () => {
  const { currentPage, totalPage } = usePaginationInfo();
  return <Stack inline spacing={4}>
    {currentPage - 2 > 1 && <PageItem num={1} />}
    {currentPage >= 5 && <div>...</div>}
    <PageItem num={currentPage - 2} />
    <PageItem num={currentPage - 1} />
    <PageItem num={currentPage} />
    <PageItem num={currentPage + 1} />
    <PageItem num={currentPage + 2} />
    {currentPage <= totalPage - 5 && <div>...</div>}
    {currentPage + 2 < totalPage && <PageItem num={totalPage} />}
  </Stack>
}

const PageItem = ({ num }: { num: number }) => {
  const { currentPage, totalPage, updatePage } = usePaginationInfo();
  return <div
    onClick={() => updatePage(num)}
    css={[
      (num < 1 || num > totalPage) && select().display('none'),
      select().width(28).height(28).borderRadius('50%').textAlign('center').lineHeight('28px'),
      select('&:hover').color(t => t.colors.primary).background(flow(theme.colors.primary, transparentize(0.8))),
      currentPage == num && select().color(t => t.colors.primary).background(flow(theme.colors.primary, transparentize(0.8))),
      // disabled && select().opacity(0.8),
    ]}
  >{num}</div>
}

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
