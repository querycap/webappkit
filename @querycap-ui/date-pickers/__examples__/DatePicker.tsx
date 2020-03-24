import { DatePicker } from "@querycap-ui/date-pickers";
import { formatRFC3339 } from "date-fns";
import React, { useState } from "react";

export const DatePickersWithLimit = () => {
  const [value, updateValue] = useState("");

  return (
    <div>
      <div>{value}</div>
      <DatePicker
        value={value}
        minValue={formatRFC3339(new Date(2019, 12, 1))}
        maxValue={formatRFC3339(new Date(Date.now()))}
        onValueChange={updateValue}
      />
    </div>
  );
};

export const DatePickers = () => {
  const [value, updateValue] = useState("");

  return (
    <div>
      <div>{value}</div>
      <DatePicker value={value} onValueChange={updateValue} />
    </div>
  );
};
