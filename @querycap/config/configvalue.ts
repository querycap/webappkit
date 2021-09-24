const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

const isBase64 = (v: string): boolean => {
  if (v === "") {
    return false;
  }
  return base64regex.test(v);
};

export type Config = { [k: string]: string };

export const parse = (s: string): Config => {
  const kvs = s.split(",");
  const c: Config = {};

  kvs.forEach((kv) => {
    if (kv == "") {
      return;
    }

    const [k, ...vs] = kv.split("=");
    const v = vs.join("=");

    if (isBase64(v)) {
      c[k] = atob(v);
    } else {
      c[k] = v;
    }
  });

  return c;
};

export const withPrefix = (o: Config): Config => {
  const ret: Config = {};

  for (const k in o) {
    ret[`APP_CONFIG__${k}`] = o[k];
  }

  return ret;
};

export const stringify = (o: Config): string => {
  const kvs: string[] = [];

  for (const k in o) {
    let v = o[k];
    if (v.indexOf(",") > -1) {
      v = btoa(v);
    }
    kvs.push(`${k}=${v}`);
  }

  return kvs.join(",");
};
