import { TimePicker } from "@querycap-ui/date-pickers";
import { useState } from "react";

export const TimePickers = () => {
  const [value, updateValue] = useState("");

  return (
    <div>
      <div>{value}</div>
      <TimePicker value={value} onValueChange={updateValue} />
    </div>
  );
};
