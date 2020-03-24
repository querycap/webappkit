import { WheelSelect } from "@querycap-ui/containers";
import { formatRFC3339, getHours, getMinutes, getSeconds, parseISO, setHours, setMinutes, setSeconds } from "date-fns";
import { padStart, times } from "lodash";
import React from "react";

export const TimePicker = ({ value, onValueChange }: { value: string; onValueChange: (val: any) => void }) => {
  const dateTime = value ? parseISO(value) : new Date(Date.now());

  const itemHeight = 30;

  return (
    <div css={{ display: "flex", width: "100%", "& > *": { flex: 1 } }}>
      <WheelSelect
        name="hour"
        sup={"时"}
        itemHeight={itemHeight}
        value={String(getHours(dateTime))}
        options={times(24).map((v) => ({
          value: String(v),
          label: padStart(String(v), 2, "0"),
        }))}
        onValueChange={(val: any) => {
          onValueChange(formatRFC3339(setHours(dateTime, val)));
        }}
      />
      <WheelSelect
        name="minute"
        sup={"分"}
        itemHeight={itemHeight}
        value={String(getMinutes(dateTime))}
        options={times(60).map((v) => ({
          value: String(v),
          label: padStart(String(v), 2, "0"),
        }))}
        onValueChange={(val: any) => onValueChange(formatRFC3339(setMinutes(dateTime, val)))}
      />
      <WheelSelect
        name="second"
        sup={"秒"}
        itemHeight={itemHeight}
        value={String(getSeconds(dateTime))}
        options={times(60).map((v) => ({
          value: String(v),
          label: padStart(String(v), 2, "0"),
        }))}
        onValueChange={(val: any) => onValueChange(formatRFC3339(setSeconds(dateTime, val)))}
      />
    </div>
  );
};
