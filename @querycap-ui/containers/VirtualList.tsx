import { combineLatest, merge, Observable, Subscription } from "rxjs";
import { mapTo, mergeAll } from "rxjs/operators";
import {
  getActualRows,
  getContainerHeight,
  getDataSliceInView,
  getIndices,
  getIndicesInViewport,
  getOptions,
  userScrollToPosition,
  getScrollDirection,
  getScrollHeight,
  getScrollTop,
  getStickyTop,
} from "./VirtualListCommon";
import { select } from "@querycap-ui/core";
import { ReactNode, useEffect, useRef, useState } from "react";
import { Dictionary } from "@querycap/lodash";

export interface IVirtualListOptions {
  height: number;
  spare?: number;
  sticky?: boolean;
  startIndex?: number;
  resize?: boolean;
}

export interface IVirtualListProps<T> {
  data$: Observable<T[]>;
  options$: Observable<IVirtualListOptions>;
  style?: { [key: string]: number | string };
  className?: string;
  keepDom?: boolean;
  uniqKey?: string;
  children?: ReactNode;
}

export interface IDataItem<T> {
  origin: T;
  $index: number;
  $pos: number;
}

export const VirtualList = <T extends Dictionary<any>>(props: IVirtualListProps<T>) => {
  const [data, setData] = useState<Array<IDataItem<T>>>([]);
  const [scrollHeight, setScrollHeight] = useState(0);

  // container dom instance
  const virtualListRef = useRef<HTMLDivElement>(null);
  const subs = useRef<Subscription>(new Subscription()).current;

  useEffect(() => {
    const virtualListElm = virtualListRef.current as HTMLElement;
    const options$ = getOptions(props.options$);
    const containerHeight$ = getContainerHeight(virtualListRef, options$);
    const scrollTop$ = getScrollTop(virtualListElm);
    const scrollDirection$ = getScrollDirection(scrollTop$);
    const actualRows$ = getActualRows(containerHeight$, options$);
    const indices$ = getIndices(scrollTop$, options$);
    const indicesInView$ = getIndicesInViewport(indices$, props.data$, actualRows$);
    const dataSliceInView$ = getDataSliceInView(props.data$, options$, indicesInView$, scrollDirection$, actualRows$);
    const scrollHeight$ = getScrollHeight(props.data$, options$);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const scrollTo$ = merge([userScrollToPosition(options$), getStickyTop(props.data$, options$).pipe(mapTo(0))]).pipe(
      mergeAll(),
    );

    subs.add(scrollTo$.subscribe((scrollTop) => (virtualListElm.scrollTop = scrollTop)));

    subs.add(
      combineLatest([dataSliceInView$, scrollHeight$]).subscribe(([data, scrollHeight]) => {
        setData(data);
        setScrollHeight(scrollHeight);
      }),
    );
    return () => {
      subs.unsubscribe();
    };
  }, []);

  return (
    <div css={select().overflowY("auto")} ref={virtualListRef}>
      <div css={select().position("relative")} style={{ height: scrollHeight }}>
        {data.map((data, i) => (
          <div
            key={props.keepDom ? i : props.uniqKey ? data.origin[props.uniqKey] : i}
            css={select().position("absolute").width("100%")}
            style={{ top: data.$pos }}
          >
            {data.origin !== undefined ? (props.children as any)(data.origin, data.$index) : null}
          </div>
        ))}
      </div>
    </div>
  );
};
