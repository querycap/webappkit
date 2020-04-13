export const preventDefault = <T extends { preventDefault: Event["preventDefault"] }>(e?: T) => {
  e && e.preventDefault && e.preventDefault();
  return e;
};

export const stopPropagation = <T extends { stopPropagation: Event["stopPropagation"] }>(e?: T) => {
  e && e.stopPropagation && e.stopPropagation();
  return e;
};

export const stopImmediatePropagation = <T extends { stopImmediatePropagation: Event["stopImmediatePropagation"] }>(
  e?: T,
) => {
  e && e.stopImmediatePropagation && e.stopImmediatePropagation();
  return e;
};
