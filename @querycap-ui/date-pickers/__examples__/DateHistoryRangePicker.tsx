import { DateHistoryRangePicker } from "@querycap-ui/date-pickers";
import { formatRFC3339 } from "date-fns";
import React, { useState } from "react";

export const DateHistoryRangePickersWithLimits = () => {
  const [value, setValue] = useState(["", ""] as [string, string]);

  return (
    <div>
      <div>{value.join(" - ")}</div>
      <DateHistoryRangePicker
        value={value}
        onValueChange={setValue}
        min={formatRFC3339(new Date(2019, 12, 1))}
        max={formatRFC3339(new Date(Date.now()))}
      />
    </div>
  );
};

export const DateHistoryRangePickers = () => {
  const [value, setValue] = useState(["", ""] as [string, string]);

  return (
    <div>
      <div>{value.join(" - ")}</div>
      <DateHistoryRangePicker value={value} onValueChange={setValue} quick />
    </div>
  );
};
