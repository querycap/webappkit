import { safeTextColor, select, theme, ThemeState, transparentize, useTheme } from "@querycap-ui/core/macro";
import {
  addDays,
  addMonths,
  addSeconds,
  format,
  formatRFC3339,
  getDate,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  lastDayOfMonth,
  parseISO,
} from "date-fns";
import { flow } from "lodash";
import React, { useEffect, useState } from "react";
import {
  DataCells,
  DatePickerHeader,
  isAfterDay,
  isAfterMonth,
  isBeforeDay,
  isBeforeMonth,
  now,
  parseISOOrDefault,
  useMonthDays,
} from "./DatePicker";

export interface DateRangePickerProps {
  max?: string;
  min?: string;
  quick?: boolean;
  value: [string, string];
  onValueChange: (value: [string, string]) => void;
  weekStartDay?: number;
}

const Cell = (props: React.HTMLAttributes<any>) => (
  <span
    css={{
      lineHeight: 1,
      flex: 1,
      padding: "0.4em 0.5em",
      textAlign: "center",
    }}
    {...props}
  />
);

export const DateHistoryRangePicker = (props: DateRangePickerProps) => {
  const [timeRange, setTimeRange] = useState(() => {
    const [from, to] = props.value || ["", ""];

    return [parseISOOrDefault(from, addMonths(now(), -1)), parseISOOrDefault(to, now())] as [Date | null, Date | null];
  });
  const [flag, setFlag] = useState(false);

  const [daysInWeeksMin, monthValueMin, setMonthMin] = useMonthDays(
    formatRFC3339(addMonths(now(), -1)),
    props.weekStartDay,
  );

  const [daysInWeeksMax, monthValueMax, setMonthMax] = useMonthDays(formatRFC3339(now()), props.weekStartDay);

  useEffect(() => {
    if (timeRange[0] && timeRange[1] && flag) {
      props.onValueChange([formatRFC3339(timeRange[0]), formatRFC3339(timeRange[1])]);
    }
  }, [timeRange[0], timeRange[1]]);

  const ds = useTheme();

  const handleNav = (deltaMonth: number) => {
    setMonthMin((p) => addMonths(p, deltaMonth));
    setMonthMax((p) => addMonths(p, deltaMonth));
  };

  const isDayInRange = (day: Date) =>
    !!timeRange[0] &&
    !!timeRange[1] &&
    (isAfterDay(day, timeRange[0]) || isSameDay(day, timeRange[0])) &&
    (isBeforeDay(day, timeRange[1]) || isSameDay(day, timeRange[1]));

  const isDaySelected = (day: Date) =>
    (!!timeRange[0] && isSameDay(day, timeRange[0])) || (!!timeRange[1] && isSameDay(day, timeRange[1]));

  const isOutOfRange = (day: Date): boolean => {
    return (!!props.max && isAfter(day, parseISO(props.max))) || (!!props.min && isBefore(parseISO(props.min), day));
  };

  return (
    <div css={{ display: "flex", width: "100%" }}>
      <div css={{ flex: 1, display: "flex" }}>
        <div css={{ minWidth: "8em", color: ds.state.color }}>
          <DatePickerHeader monthValue={monthValueMin} onNav={handleNav} navRightDisabled />
          <DataCells daysInWeeks={daysInWeeksMin}>
            {(day, idx) => {
              const isCurrentMonth = isSameMonth(day, monthValueMin);

              return (
                <DayCell
                  key={idx}
                  day={day}
                  disabled={isOutOfRange(day)}
                  onSelected={(day) => {
                    if (isBeforeMonth(day, monthValueMin)) {
                      handleNav(-1);
                    }
                    setTimeRange((pr) => {
                      return maySwitchRange(pr, day);
                    });
                    setFlag(true);
                  }}
                  isInRange={isCurrentMonth && isDayInRange(day)}
                  isSelected={isCurrentMonth && isDaySelected(day)}
                  isCurrentMonth={isCurrentMonth}
                />
              );
            }}
          </DataCells>
        </div>
        <div css={{ minWidth: "8em", color: ds.state.color }}>
          <DatePickerHeader monthValue={monthValueMax} onNav={handleNav} navLeftDisabled />
          <DataCells daysInWeeks={daysInWeeksMax}>
            {(day, idx) => {
              const isCurrentMonth = isSameMonth(day, monthValueMax);

              return (
                <DayCell
                  key={idx}
                  day={day}
                  disabled={isOutOfRange(day)}
                  onSelected={(day) => {
                    if (isAfterMonth(day, monthValueMax)) {
                      handleNav(1);
                    }
                    setTimeRange((pr) => {
                      return maySwitchRange(pr, day);
                    });
                    setFlag(true);
                  }}
                  isCurrentMonth={isCurrentMonth}
                  isInRange={isCurrentMonth && isDayInRange(day)}
                  isSelected={isCurrentMonth && isDaySelected(day)}
                />
              );
            }}
          </DataCells>
        </div>
      </div>
      {props.quick && (
        <QuickSelect
          onSelect={(from, to) => {
            setTimeRange([from, to]);
            setFlag(true);
          }}
        />
      )}
    </div>
  );
};

const getToday = () => {
  const n = now();
  return new Date(getYear(n), getMonth(n), getDate(n));
};

const DayCell = ({
  day,
  isCurrentMonth,
  isInRange,
  isSelected,
  onSelected,
  isToday,
  disabled,
}: {
  day: Date;
  isSelected?: boolean;
  isInRange?: boolean;
  isToday?: boolean;
  isCurrentMonth?: boolean;
  disabled?: boolean;
  onSelected: (day: Date) => void;
}) => {
  return (
    <ThemeState
      backgroundColor={
        isSelected
          ? theme.colors.primary
          : isInRange
          ? flow(theme.colors.primary, transparentize(0.8))
          : theme.state.backgroundColor
      }
      color={
        isSelected ? flow(theme.colors.primary, safeTextColor) : isToday ? theme.colors.primary : theme.state.color
      }>
      <Cell
        css={select()
          .color(theme.state.color)
          .backgroundColor(theme.state.backgroundColor)
          .with(!isCurrentMonth && { opacity: 0.6 })
          .with(disabled ? { opacity: 0.5 } : { "&:hover": { opacity: 0.7, cursor: "pointer" } })}
        onClick={disabled ? undefined : () => onSelected(day)}>
        {format(day, "d")}
      </Cell>
    </ThemeState>
  );
};

export const QuickSelect = ({ onSelect }: { onSelect: (from: Date, to: Date) => void }) => (
  <div
    css={select()
      .borderLeft(flow(theme.state.borderColor, (color) => `1px solid ${color}`))
      .with({
        width: "8em",
        padding: "1em",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      })
      .with(select("& > *").cursor("pointer").padding("0.5em 0").color(theme.colors.primary))}>
    <div
      onClick={() => {
        const today = getToday();

        onSelect(today, addSeconds(addDays(today, 1), -1));
      }}>
      今天
    </div>
    <div
      onClick={() => {
        const today = getToday();

        onSelect(addDays(today, -1), addSeconds(today, -1));
      }}>
      昨天
    </div>
    <div
      onClick={() => {
        const today = getToday();

        onSelect(addDays(today, -6), today);
      }}>
      最近 7 天
    </div>
    <div
      onClick={() => {
        const today = getToday();

        onSelect(addDays(today, -29), today);
      }}>
      最近 30 天
    </div>
    <div
      onClick={() => {
        const today = getToday();

        onSelect(new Date(getYear(today), getMonth(today), 1), today);
      }}>
      本月
    </div>
    <div
      onClick={() => {
        const today = now();

        const firstDay = addMonths(new Date(getYear(today), getMonth(today), 1), -1);

        onSelect(firstDay, lastDayOfMonth(firstDay));
      }}>
      上月
    </div>
  </div>
);

function maySwitchRange(range: [Date | null, Date | null], nextSelected: Date): [Date | null, Date | null] {
  if (range[0] && range[1]) {
    return [nextSelected, null];
  }

  if (range[0] && !range[1]) {
    if (isAfter(range[0], nextSelected)) {
      return [nextSelected, range[0]];
    }
    return [range[0], nextSelected];
  }

  return [nextSelected, null];
}
