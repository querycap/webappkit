import { DateWheelPicker } from "@querycap-ui/date-pickers";
import React, { useState } from "react";

export const DateWheelPickers = () => {
  const [value, updateValue] = useState("");

  return (
    <div>
      <div>{value}</div>
      <DateWheelPicker value={value} onValueChange={updateValue} />
    </div>
  );
};
