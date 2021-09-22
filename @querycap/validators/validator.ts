import { isError } from "lodash";

export type Validator<T = any> = (valueOrError: T | Error) => T | Error;

export const errorMsg = <T extends any>(v: T | Error) => {
  if (isError(v)) {
    return v.message;
  }
  return undefined;
};

export const createValidator =
  <T = any>(defaultError: string, test: (v: T) => boolean) =>
  (error = defaultError) => {
    return (valueOrError: T | Error) => {
      if (isError(valueOrError)) {
        return valueOrError;
      }

      if (!test(valueOrError)) {
        return new Error(error);
      }

      return valueOrError;
    };
  };

export const all = <T extends any>(...validators: Validator[]) => {
  return (valueOrError: T | Error) => {
    if (isError(valueOrError)) {
      return valueOrError;
    }

    const e: string[] = [];

    for (const v of validators) {
      const ret = v(valueOrError);

      if (isError(ret)) {
        e.push(ret.message);
      }
    }

    return new Error(e.join("; "));
  };
};
