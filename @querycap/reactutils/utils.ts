export const tap = <T extends any = any>(fn?: (v: T) => void) => {
  return (v: T) => {
    fn && fn(v);
    return v;
  };
};
