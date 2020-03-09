import { includes, split } from "lodash";

export interface IRange {
  from?: string;
  to?: string;
  exactly?: boolean;
  exclusiveFrom?: boolean;
  exclusiveTo?: boolean;
}

export const stringifyRange = (r: IRange = {}) => {
  let v = "";

  if (r.from) {
    v += r.from;
    if (r.exclusiveFrom) {
      v += "<";
    }
  }

  if (!r.exactly) {
    v += "..";

    if (r.to) {
      if (r.exclusiveTo) {
        v += "<";
      }
      v += r.to;
    }
  }

  return v;
};

export const parseRange = (v = "") => {
  const r: IRange = {};

  const fromTo = split(v, "..");

  r.exactly = !includes(v, "..");

  if (fromTo.length > 0) {
    r.from = fromTo[0];

    if (r.from != "") {
      const lastChar = r.from[r.from.length - 1];
      if (lastChar == "!" || lastChar == "<") {
        r.from = r.from.slice(0, r.from.length - 1);
        r.exclusiveFrom = true;
      }
    }
  }

  if (fromTo.length > 1) {
    r.to = fromTo[1];

    if (r.to != "") {
      const firstChar = r.to[0];
      if (firstChar == "!" || firstChar == "<") {
        r.to = r.to.slice(1);
        r.exclusiveTo = true;
      }
    }
  }

  return r;
};
