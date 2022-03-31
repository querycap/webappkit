export const tap = <T = any>(fn?: (v: T) => void) => {
  return (v: T) => {
    fn && fn(v);
    return v;
  };
};
