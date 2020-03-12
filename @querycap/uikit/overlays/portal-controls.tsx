import { useValueRef } from "@querycap/reactutils";
import { invariant } from "hey-listen";
import { noop, toUpper } from "lodash";
import { RefObject, useEffect } from "react";
import { fromEvent, merge as observableMerge } from "rxjs";
import { bufferTime, delay as rxDelay, filter as rxFilter } from "rxjs/operators";
import { usePortalContext } from "./Portal";

export function usePortalCloseOnOutsideClick(close: () => void = noop, elementRefs: Array<RefObject<Element | null>>) {
  const { container } = usePortalContext();
  const containerRef = useValueRef(container);

  return useCloseOnOutsideClick(close, [containerRef, ...elementRefs]);
}

export function useCloseOnOutsideClick(close: () => void, elementRefs: Array<RefObject<Element | null>>) {
  const closeRef = useValueRef(close);

  useEffect(() => {
    const root$ = globalThis.document.getElementById("root");

    const sub = observableMerge(fromEvent(globalThis.document, "mouseup"), fromEvent(globalThis.document, "touchend"))
      .pipe(
        rxFilter((e) => {
          if ((e as any).button && (e as any).button !== 0) {
            return false;
          }

          const target = (e as any).target;

          // 忽略其他浏览器插件影响
          if (
            root$ &&
            !root$.contains(target) &&
            !globalThis.document.querySelector("[data-portal-id]")?.contains(target)
          ) {
            return false;
          }

          for (let i = 0; i < elementRefs.length; i++) {
            const $el = elementRefs[i].current;
            if ($el && $el.contains(target)) {
              return false;
            }
          }

          return true;
        }),
        rxDelay(0.02), // delay to trigger and avoid close when unmounted
      )
      .subscribe(() => {
        closeRef.current();
      });

    return () => {
      sub.unsubscribe();
    };
  }, []);
}

export function usePortalCloseOnEsc(close: () => void = noop) {
  const { stack, pid } = usePortalContext();

  if (process.env.NODE_ENV !== "production") {
    invariant(!!pid, "usePortalCloseOnEsc must in container");
  }

  const stackRef = useValueRef(stack);
  const closeRef = useValueRef(close);

  useEffect(() => {
    const sub = fromEvent<KeyboardEvent>(document, "keydown")
      .pipe(
        rxFilter((e) => toUpper(e.key) === "ESCAPE"),
        bufferTime(500),
      )
      .subscribe((events) => {
        if (events.length > 0) {
          // 单击单隐藏, 双击全隐藏
          if (stackRef.current.top() == pid || events.length > 1) {
            closeRef.current();
          }
        }
      });

    return () => {
      sub.unsubscribe();
    };
  }, []);
}
