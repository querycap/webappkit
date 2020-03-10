import { useValueRef } from "@querycap/reactutils";
import { isEqual, mapValues } from "lodash";
import { RefObject, useCallback, useEffect, useLayoutEffect, useState } from "react";
import { animationFrameScheduler, fromEvent as observableFromEvent, merge as observableMerge } from "rxjs";
import { observeOn } from "rxjs/operators";
import { getScrollParents } from "../domutils";

export interface IRect {
  top: number;
  left: number;
  width: number;
  height: number;
  placement: "top" | "bottom";
}

export const getBoundingClientRect = (target: Element): Omit<{ [k in keyof DOMRect]: number }, "toJSON"> => {
  return mapValues(target.getBoundingClientRect().toJSON(), (v: number) => Math.floor(v) || 0) as any;
};

export const position = (target: Element, related: Element): IRect => {
  const targetRect = getBoundingClientRect(target);
  const relatedRect = getBoundingClientRect(related);

  return {
    top: targetRect.top - relatedRect.top,
    left: targetRect.left - relatedRect.left,
    width: targetRect.width,
    height: targetRect.height,
    placement: targetRect.top > globalThis.innerHeight / 2 ? "top" : "bottom",
  };
};

export const defaultRect: IRect = {
  left: 0,
  top: 0,
  width: 0,
  height: 0,
  placement: "top",
};

const useOnReLayout = (elmRef: RefObject<Element | null>, cb: () => void, disabled: boolean) => {
  const cbRef = useValueRef(cb);

  useEffect(() => {
    if (disabled || !elmRef.current) {
      return;
    }

    const scrolledParents = getScrollParents(elmRef.current);
    const events$ = scrolledParents.map((scrolledParent) => observableFromEvent(scrolledParent, "scroll"));

    const onResizeOrScroll = observableMerge(...events$, observableFromEvent(window, "resize"))
      .pipe(observeOn(animationFrameScheduler))
      .subscribe(() => {
        cbRef.current();
      });

    return () => {
      onResizeOrScroll.unsubscribe();
    };
  }, [elmRef.current, disabled]);
};

export const useRectOfElement = (elmRef: RefObject<Element | null>, refreshWhenRelayout = true, deps: any[] = []) => {
  const [rect, setRect] = useState(defaultRect);

  const refresh = useCallback(() => {
    if (elmRef.current) {
      setRect((prev) => {
        const next = position(elmRef.current!, document.body);
        if (isEqual(next, prev)) {
          return prev;
        }
        return next;
      });
    }
  }, []);

  // need to get rect immediately
  useLayoutEffect(() => {
    refresh();
  }, [elmRef.current, ...deps]);

  useOnReLayout(elmRef, refresh, !refreshWhenRelayout);

  return [rect, refresh] as const;
};

export const calcPosition = (finalPlacement: string, triggerRect: IRect, contentRect: IRect) => {
  let left = triggerRect.left;
  let top = triggerRect.top;

  switch (finalPlacement) {
    case "bottom": {
      top += triggerRect.height;
      left += (triggerRect.width - contentRect.width) / 2;
      break;
    }
    case "bottom-left": {
      top += triggerRect.height;
      break;
    }
    case "bottom-right": {
      top += triggerRect.height;
      left += triggerRect.width - contentRect.width;
      break;
    }
    case "top": {
      top -= contentRect.height;
      left += (triggerRect.width - contentRect.width) / 2;
      break;
    }
    case "top-left": {
      top -= contentRect.height;
      break;
    }
    case "top-right": {
      top -= contentRect.height;
      left += triggerRect.width - contentRect.width;
      break;
    }
    case "left": {
      left -= contentRect.width;
      top -= (contentRect.height - triggerRect.height) / 2;
      break;
    }
    case "left-top": {
      left -= contentRect.width;
      break;
    }
    case "left-bottom": {
      left -= contentRect.width;
      top -= contentRect.height - triggerRect.height;
      break;
    }
    case "right": {
      left += triggerRect.width;
      top -= (contentRect.height - triggerRect.height) / 2;
      break;
    }
    case "right-top": {
      left += triggerRect.width;
      break;
    }
    case "right-bottom": {
      left += triggerRect.width;
      top -= contentRect.height - triggerRect.height;
      break;
    }
  }

  return [left, top];
};
