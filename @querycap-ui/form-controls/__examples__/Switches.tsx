import { themes } from "@querycap-ui/core";
import { Switch } from "@querycap-ui/form-controls";
import { Stack } from "@querycap-ui/layouts";
import React, { useState } from "react";

export const Switches = () => {
  const [checked, setCheck] = useState(true);

  return (
    <Stack spacing={themes.space.s2}>
      <label>
        <Switch value={checked} disabled onValueChange={setCheck} />
      </label>
      <label>
        <Switch value={checked} onValueChange={setCheck} tips={["on", "off"]} />
      </label>
      <label css={{ fontSize: "2em" }}>
        <Switch value={checked} onValueChange={setCheck} />
      </label>
    </Stack>
  );
};
