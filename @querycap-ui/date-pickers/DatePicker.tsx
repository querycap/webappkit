import { safeTextColor, select, theme, ThemeState, useTheme } from "@querycap-ui/core/macro";
import { IconChevronLeft, IconChevronRight } from "@querycap-ui/icons";
import {
  addDays,
  addMonths,
  addWeeks,
  format as originFormat,
  formatRFC3339,
  getDate,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import { zhCN } from "date-fns/locale";
import { Dictionary, floor, flow, forEach, map, set } from "lodash";
import React, { ReactNode, useEffect, useMemo, useState } from "react";

export const format = (date: number | Date, formatStr: string) => {
  return originFormat(date, formatStr, {
    locale: zhCN,
  });
};

const NavBtn = ({ children, ...otherProps }: { disabled?: boolean } & React.HTMLAttributes<HTMLAnchorElement>) => {
  return (
    <a
      href={"#"}
      {...otherProps}
      css={select().colorFill(theme.state.color).with({
        outline: 0,
        margin: 0,
        cursor: "pointer",
      })}>
      <span>{children}</span>
    </a>
  );
};

export const DAY = "day";
export const MONTH = "month";

export const getDaysInMonth = (value: string, weekStartDay: number) => {
  const first = startOfMonth(parseISO(value));

  let start = startOfWeek(first, {
    weekStartsOn: weekStartDay as any,
  }); // 0 ~ 6 => Sun. Mon.

  const result = [];

  let i = 0;

  if (isSameDay(first, start) || isBefore(first, start)) {
    start = addWeeks(start, -1);
  }

  for (; i < 42; i++) {
    result.push(start);
    start = addDays(start, 1);
  }

  return result;
};

export interface IDatePickerProps {
  value: string;
  maxValue?: string;
  minValue?: string;
  onValueChange: (value: string) => void;
  weekStartDay?: number;
  showTime?: boolean;
}

export const now = () => new Date(Date.now());

export const parseISOOrDefault = <T extends any>(value = "", defaultDate: T) => {
  return value ? parseISO(value) : defaultDate;
};

export const useDatePicker = (value: string) => {
  const [selectedDate, setState] = useState(() => parseISOOrDefault(value, new Date(Date.now())));

  const { now, selectDate } = useMemo(() => {
    return {
      now: Date.now(),
      selectDate: (nextDateValue: Date) => {
        setState(() => nextDateValue);
      },
    };
  }, []);

  return [selectedDate, now, selectDate] as const;
};

export const isAfterMonth = (date: Date, dateCompare: Date) => {
  return isAfter(new Date(getYear(date), getMonth(date)), new Date(getYear(dateCompare), getMonth(dateCompare)));
};

export const isBeforeMonth = (date: Date, dateCompare: Date) => {
  return isBefore(new Date(getYear(date), getMonth(date)), new Date(getYear(dateCompare), getMonth(dateCompare)));
};

export const isAfterDay = (date: Date, dateCompare: Date) => {
  return isAfter(
    new Date(getYear(date), getMonth(date), getDate(date)),
    new Date(getYear(dateCompare), getMonth(dateCompare), getDate(dateCompare)),
  );
};

export const isBeforeDay = (date: Date, dateCompare: Date) => {
  return isBefore(
    new Date(getYear(date), getMonth(date), getDate(date)),
    new Date(getYear(dateCompare), getMonth(dateCompare), getDate(dateCompare)),
  );
};

export const useDateRange = (minValue?: string, maxValue?: string) => {
  const { isDateSmallThan, isDateLargeThan } = useMemo(() => {
    const dateValueMin = parseISOOrDefault(minValue, undefined);
    const dateValueMax = parseISOOrDefault(maxValue, undefined);

    return {
      isDateSmallThan: (date: Date, unit: "day" | "month"): boolean => {
        if (!dateValueMin) {
          return false;
        }
        if (unit === "month") {
          return isBeforeMonth(date, dateValueMin) || isSameMonth(date, dateValueMin);
        }
        return isBeforeDay(date, dateValueMin);
      },
      isDateLargeThan: (date: Date, unit: "day" | "month"): boolean => {
        if (!dateValueMax) {
          return false;
        }

        if (unit === "month") {
          return isAfterMonth(date, dateValueMax) || isSameMonth(date, dateValueMax);
        }

        return isAfterDay(date, dateValueMax);
      },
    };
  }, [minValue, maxValue]);

  return [isDateSmallThan, isDateLargeThan];
};

export const useMonthDays = (value: string, weekStartDay?: number) => {
  const [monthValue, setMonth] = useState<Date>(() => parseISOOrDefault(value, now()));

  const daysInWeeks = useMemo(() => {
    // default: start with sunday.
    return groupByWeek(getDaysInMonth(formatRFC3339(monthValue), weekStartDay || 0));
  }, [formatRFC3339(monthValue)]);

  return [daysInWeeks, monthValue, setMonth] as const;
};

interface IDayCellProps {
  isToday: boolean;
  isInPrevMonth: boolean;
  isInNextMonth: boolean;
  isSelected: boolean;
  disabled: boolean;
  dayValue: Date;

  onSelect(dateValue: Date): void;
}

export const WeekRow = (props: React.HTMLAttributes<any>) => (
  <span
    css={{
      display: "flex",
      margin: "0.5em 0",
      alignItems: "center",
    }}
    {...props}
  />
);

export const Cell = (props: React.HTMLAttributes<any>) => (
  <span
    css={{
      lineHeight: 1,
      flex: 1,
      padding: "0.4em 0.5em",
      margin: "0 0.5em",
      textAlign: "center",
      borderRadius: 2,
    }}
    {...props}
  />
);

export const DayCell = ({
  dayValue,
  onSelect,
  isSelected,
  isInNextMonth,
  isInPrevMonth,
  isToday,
  disabled,
  ...otherProps
}: IDayCellProps) => {
  return (
    <ThemeState
      backgroundColor={isSelected && !disabled ? theme.colors.primary : theme.state.backgroundColor}
      color={
        isSelected ? flow(theme.colors.primary, safeTextColor) : isToday ? theme.colors.primary : theme.state.color
      }>
      <Cell
        {...otherProps}
        css={select()
          .color(theme.state.color)
          .backgroundColor(theme.state.backgroundColor)
          .with((isInPrevMonth || isInNextMonth) && { opacity: 0.6 })
          .with(disabled ? { opacity: 0.5 } : { "&:hover": { opacity: 0.7, cursor: "pointer" } })}
        onClick={() => onSelect(dayValue)}>
        {format(dayValue, "d")}
      </Cell>
    </ThemeState>
  );
};

function groupByWeek(days: Date[]): Dictionary<Dictionary<Date>> {
  const weeks = {};

  forEach(days, (day, idx) => {
    set(weeks, [floor(idx / 7, 0), idx % 7], day);
  });

  return weeks;
}

export const DatePickerHeader = ({
  navLeftDisabled,
  navRightDisabled,
  onNav,
  monthValue,
}: {
  monthValue: Date;
  onNav: (deltaMonth: number) => void;
  navLeftDisabled?: boolean;
  navRightDisabled?: boolean;
}) => (
  <div
    css={select()
      .padding("0 0.5em")
      .borderBottom(flow(theme.state.borderColor, (color) => `2px solid ${color}`))}>
    <WeekRow>
      <NavBtn css={[navLeftDisabled && { visibility: "hidden" }]} disabled={navLeftDisabled} onClick={() => onNav(-1)}>
        <IconChevronLeft />
      </NavBtn>
      <Cell style={{ width: "80%" }}>{format(monthValue, "yyyy 年 M 月")}</Cell>
      <NavBtn css={[navRightDisabled && { visibility: "hidden" }]} disabled={navRightDisabled} onClick={() => onNav(1)}>
        <IconChevronRight />
      </NavBtn>
    </WeekRow>
  </div>
);

export const DataCells = ({
  daysInWeeks,
  children,
}: {
  weekStartDay?: number;
  daysInWeeks: ReturnType<typeof useMonthDays>[0];
  children: (day: Date, idx: number) => ReactNode;
}) => {
  return (
    <>
      <WeekRow>
        {map(daysInWeeks[0], (day, idx) => {
          return <Cell key={idx}>{format(day, "eeeee")}</Cell>;
        })}
      </WeekRow>
      {map(daysInWeeks, (daysInWeek, weekNumber) => (
        <WeekRow key={weekNumber}>{map(daysInWeek, children)}</WeekRow>
      ))}
    </>
  );
};

export const DatePicker = (props: IDatePickerProps) => {
  const [dateValue, now, selectDay] = useDatePicker(props.value);
  const [daysInWeeks, monthValue, setMonth] = useMonthDays(props.value, props.weekStartDay);

  useEffect(() => {
    if (formatRFC3339(dateValue) === props.value) {
      return;
    }
    props.onValueChange(formatRFC3339(dateValue));
    setMonth(() => dateValue);
  }, [formatRFC3339(dateValue)]);

  const [isDateSmallThan, isDateLargeThan] = useDateRange(props.minValue, props.maxValue);

  const ds = useTheme();

  return (
    <div css={{ minWidth: "8em", color: ds.state.color }}>
      <DatePickerHeader
        monthValue={monthValue}
        navLeftDisabled={isDateSmallThan(monthValue, MONTH)}
        navRightDisabled={isDateLargeThan(monthValue, MONTH)}
        onNav={(deltaMonth) => setMonth(addMonths(monthValue, deltaMonth))}
      />
      <DataCells daysInWeeks={daysInWeeks} weekStartDay={props.weekStartDay}>
        {(day, idx) => {
          const dayOutRange = isDateSmallThan(day, DAY) || isDateLargeThan(day, DAY);

          return (
            <DayCell
              key={idx}
              dayValue={day}
              onSelect={dayOutRange ? () => undefined : selectDay}
              disabled={dayOutRange}
              isSelected={!dayOutRange && format(day, "yyyy-MM-dd") === format(dateValue, "yyyy-MM-dd")}
              isToday={isSameDay(now, day)}
              isInPrevMonth={getMonth(day) < getMonth(monthValue)}
              isInNextMonth={getMonth(day) > getMonth(monthValue)}
            />
          );
        }}
      </DataCells>
    </div>
  );
};
