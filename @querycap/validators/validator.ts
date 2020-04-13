import { isEmpty } from "lodash";

export type Validator<T = any> = (value: T) => string | undefined;

export const createValidator = <T = any>(defaultError: string, test: (v: T) => boolean) => (error = defaultError) => {
  return (value: T) => {
    if (isEmpty(value)) {
      return undefined;
    }
    if (test(value)) {
      return undefined;
    }
    return error;
  };
};

export const once = (...validators: Validator[]) => {
  return (value: any) => {
    for (const v of validators) {
      const err = v(value);

      if (err) {
        return err;
      }
    }
    return undefined;
  };
};

export const all = (...validators: Validator[]) => {
  return (value: any) => {
    const e: string[] = [];

    for (const v of validators) {
      const err = v(value);

      if (err) {
        e.push(err);
      }
    }

    return e.join("; ");
  };
};
