import { useValueRef } from "@querycap/reactutils";
import { parseSearchString, toSearchString, useRouter } from "@reactorx/router";
import { isArray, omit, pickBy } from "lodash";
import { useEffect, useState } from "react";

export const useQueryState = <T extends string | string[]>(queryKey: string, defaultValue: T) => {
  const { location, history } = useRouter();
  const query = parseSearchString(location.search);
  const queryRef = useValueRef(query);

  const [value, setValue] = useState<T>(() => {
    if (isArray(defaultValue)) {
      return query[queryKey] ? [].concat(query[queryKey]) : defaultValue;
    }
    return query[queryKey] || defaultValue;
  });

  // sync to url when value change
  useEffect(() => {
    history.replace({
      ...history.location,
      search: toSearchString(
        pickBy(
          {
            ...queryRef.current,
            [queryKey]: value,
          },
          (v) => v,
        ),
      ),
    });
  }, [value]);

  // remove all key when component unmount
  useEffect(() => {
    return () => {
      history.replace({
        ...history.location,
        search: toSearchString(omit(parseSearchString(history.location.search), [queryKey])),
      });
    };
  }, []);

  return [value, setValue] as const;
};
