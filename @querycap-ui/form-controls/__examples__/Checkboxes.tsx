import { Checkbox } from "@querycap-ui/form-controls";
import React, { useState } from "react";

export const Checkboxes = () => {
  const [checked, setCheck] = useState(true);

  return (
    <>
      <label>
        <Checkbox value={checked} onValueChange={setCheck}>
          是否同意
        </Checkbox>
      </label>
      <label>
        <Checkbox value={checked} indeterminate onValueChange={setCheck}>
          是否同意
        </Checkbox>
      </label>
      <label>
        <Checkbox value={checked} disabled onValueChange={setCheck}>
          是否同意
        </Checkbox>
      </label>
    </>
  );
};
