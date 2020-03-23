import { themes } from "@querycap-ui/core";
import { Switch } from "@querycap-ui/form-controls";
import { Stack } from "@querycap-ui/layouts";
import React, { useState } from "react";

export const Switches = () => {
  const [checked, setCheck] = useState(true);

  return (
    <Stack spacing={themes.space.s2}>
      <div>
        <Switch value={checked} disabled onValueChange={setCheck} /> <span>文本</span>
      </div>
      <div>
        <Switch value={checked} onValueChange={setCheck} tips={["on", "off"]} /> <span>文本</span>
      </div>
      <div css={{ fontSize: "2em" }}>
        <Switch value={checked} onValueChange={setCheck} /> <span>文本</span>
      </div>
    </Stack>
  );
};
