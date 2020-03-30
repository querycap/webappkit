import { useRef } from "react";

export const areInputsEqual = (newInputs: readonly unknown[], lastInputs: readonly unknown[]): boolean => {
  if (newInputs.length !== lastInputs.length) {
    return false;
  }
  for (let i = 0; i < newInputs.length; i++) {
    if (newInputs[i] !== lastInputs[i]) {
      return false;
    }
  }
  return true;
};

export type EqualityFn = (newArgs: any[], lastArgs: any[]) => boolean;

export const useMemoizeOnce = <Computed extends (...newArgs: any[]) => ReturnType<Computed>>(
  resultFn: Computed,
  isEqual: EqualityFn = areInputsEqual,
): Computed => {
  const ref = useRef<{
    lastArgs: unknown[];
    lastResult: ReturnType<Computed>;
    calledOnce: boolean;
  }>({
    lastArgs: [],
    lastResult: undefined as any,
    calledOnce: false,
  });

  const memoized = (...newArgs: unknown[]): ReturnType<Computed> => {
    if (ref.current.calledOnce && isEqual(newArgs, ref.current.lastArgs)) {
      return ref.current.lastResult;
    }

    ref.current.lastResult = resultFn(...newArgs);
    ref.current.calledOnce = true;
    ref.current.lastArgs = newArgs;

    return ref.current.lastResult;
  };

  return memoized as Computed;
};
