export type Validator<T = any> = (value: T) => string | undefined;

export const createValidator = <T = any>(defaultError: string, test: (v: T) => boolean) => (error = defaultError) => {
  return (value: T) => {
    if (test(value)) {
      return undefined;
    }
    return error;
  };
};

export const validateQueue = (...validators: Validator[]) => {
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

export const validateAll = (...validators: Validator[]) => {
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
