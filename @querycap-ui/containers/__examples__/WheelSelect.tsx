import { WheelSelect } from "@querycap-ui/containers";
import { times } from "lodash";
import React, { useState } from "react";

const opts = times(100).map((_, i) => ({
  value: `${i}`,
  label: `${i}`,
}));

export const WheelSelects = () => {
  const [value, updateValue] = useState("10");

  return (
    <div>
      <WheelSelect name="k" itemHeight={36} options={opts} value={value} onValueChange={updateValue} />
    </div>
  );
};
