import { WheelSelect } from "@querycap-ui/containers";
import { formatRFC3339, getDate, getDaysInMonth, getHours, getMinutes, getMonth, getYear, parseISO } from "date-fns";
import { isUndefined, map, padStart, times } from "lodash";
import React, { useEffect, useMemo, useState } from "react";

interface IDate {
  year?: number;
  month?: number;
  date?: number;
  hour?: number;
  minute?: number;
}

const labels = {
  year: "年",
  month: "月",
  date: "日",
  hour: "时",
  minute: "分",
};

const toOptions = (range: [number, number], zeroPrefix?: number, desc?: boolean) => {
  return map(times(range[1] - range[0] + 1), (_, i) => {
    const v = desc ? range[1] - i : range[0] + i;

    return {
      label: `${zeroPrefix ? padStart(`${v}`, zeroPrefix, "0") : v}`,
      value: `${v}`,
    };
  });
};

export const getOptions = (type: keyof IDate, date: IDate, min: Date | null, max: Date | null) => {
  const now = Date.now();
  const currentYear = getYear(now);
  const currentMonth = getMonth(now) + 1;

  const yearRange = [currentYear - 10, currentYear] as [number, number];
  const monthRange = [1, 12] as [number, number];
  const dateRange = [1, getDaysInMonth(new Date(date.year || currentYear, (date.month || currentMonth) - 1))] as [
    number,
    number,
  ];

  const hourRange = [0, 23] as [number, number];
  const minuteRange = [0, 59] as [number, number];

  const setRange = (i: number, v: Date) => {
    yearRange[i] = getYear(v);

    // 同年
    if (!isUndefined(date.year) && date.year === getYear(v)) {
      monthRange[i] = getMonth(v) + 1;

      // 同月
      if (!isUndefined(date.month) && date.month === getMonth(v) + 1) {
        dateRange[i] = getDate(v);

        // 同日
        if (!isUndefined(date.date) && date.date === getDate(v)) {
          hourRange[i] = getHours(v);

          // 同时
          if (!isUndefined(date.hour) && date.hour === getHours(v)) {
            minuteRange[i] = getMinutes(v);
          }
        }
      }
    }
  };

  if (min) {
    setRange(0, min);
  }

  if (max) {
    setRange(1, max);
  }

  switch (type) {
    case "year":
      return toOptions(yearRange, 0, true);
    case "month":
      return toOptions(monthRange, 2);
    case "date":
      return toOptions(dateRange, 2);
    case "hour":
      return toOptions(hourRange, 2);
    case "minute":
      return toOptions(minuteRange, 2);
  }

  return [];
};

const parseDate = (v: string) => {
  const d = v ? parseISO(v) : Date.now();

  return {
    year: getYear(d),
    month: getMonth(d) + 1,
    date: getDate(d),
    hour: getHours(d),
    minute: getMinutes(d),
  };
};

const stringifyDate = (date: IDate, withTime?: boolean) => {
  return formatRFC3339(
    new Date(
      date.year || 0,
      (date.month || 1) - 1 || 0,
      date.date || 0,
      withTime ? date.hour || 0 : 0,
      withTime ? date.minute || 0 : 0,
    ),
  );
};

export function DateWheelPicker({
  value,
  withTime,
  minValue,
  maxValue,
  onValueChange,
}: {
  value: string;
  minValue?: string;
  maxValue?: string;
  withTime?: boolean;
  onValueChange: (v: string) => void;
}) {
  const { min, max } = useMemo(
    () => ({
      min: minValue ? parseISO(minValue) : null,
      max: maxValue ? parseISO(maxValue) : null,
    }),
    [minValue, maxValue],
  );

  const [date, setDate] = useState<IDate>(() => parseDate(value));

  useEffect(() => {
    onValueChange(stringifyDate(date, withTime));
  }, [date]);

  const options = useMemo(
    () => ({
      year: getOptions("year", date, min, max),
      month: getOptions("month", date, min, max),
      date: getOptions("date", date, min, max),
      ...(withTime
        ? {
            hour: getOptions("hour", date, min, max),
            minute: getOptions("minute", date, min, max),
          }
        : {}),
    }),
    [date.year, date.month, min, max, withTime],
  );

  return (
    <div
      css={{
        display: "flex",
      }}>
      {map(options, (opts, key: any) => (
        <WheelSelect
          key={key === "date" ? `date:${date.year}:${date.month}` : key}
          sup={(labels as any)[key]}
          name={key}
          itemHeight={30}
          options={opts}
          value={(date as any)[key] ? `${(date as any)[key]}` : ""}
          onValueChange={(year) =>
            setDate((date) => ({
              ...date,
              [key]: Number(year),
            }))
          }
        />
      ))}
    </div>
  );
}
