import { useValueRef } from "@querycap/reactutils";
import { useObservableEffect } from "@reactorx/core";
import { RefObject, useEffect } from "react";
import { fromEvent } from "rxjs";
import { filter, switchMap, tap } from "rxjs/operators";

export const useToggleControlOnClick = (ref: RefObject<HTMLDivElement>, toggle: () => void) => {
  const toggleRef = useValueRef(toggle);

  useObservableEffect(() => {
    if (!ref.current) {
      return;
    }

    return fromEvent(ref.current, "click").pipe(tap(() => toggleRef.current()));
  }, []);
};

/*
   根据反馈，之前的遮罩存在一个在卡片内按下，移动到卡片外会关闭遮罩的问题，所以用 rxjs 来做判断
   必须按下的元素要和绑定事件的元素为同一个，才会在鼠标点击的时候触发关闭遮罩事件
   现在不管是从卡片按下移动到遮罩抬起，还是从遮罩按下移动到卡片抬起，都不会再触发关闭
 */
export function useOnExactlyClick(ref: RefObject<null | HTMLElement>, callback: () => void, disabled: boolean) {
  const callbackRef = useValueRef(callback);

  useEffect(() => {
    if (!ref.current || disabled) {
      // disabled 或 dom ref 无挂载销毁监听
      return;
    }

    const $target = ref.current;

    const sub = fromEvent($target, "mousedown")
      .pipe(
        switchMap((mousedownEvent) =>
          fromEvent($target, "mouseup").pipe(
            filter((e) => {
              // 抬起触发的元素必须和按下的相同，否则不触发关闭
              return e.target === mousedownEvent.target;
            }),
          ),
        ),
        filter((e) => {
          // 按下触发的元素必须和绑定事件的相同，否则不触发关闭
          return e.target === e.currentTarget;
        }),
      )
      .subscribe(() => {
        // 使用 ref 确保调用总是更新的
        callbackRef.current();
      });

    return () => {
      sub.unsubscribe();
    };
  }, [disabled, ref.current]);
}
