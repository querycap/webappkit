import { Stack } from "../../layouts/Stack";
import { ButtonRadio, Radio } from "../Radio";
import { useState } from "react";
import { map } from "lodash";

export const Radioes = () => {
  const [check, setCheck] = useState("Hangzhou");
  const options = ["Hangzhou", "Shanghai", "Chengdu", "Beijing"];
  return (
    <Stack spacing={20} inline>
      {map(options, (option) => (
        <Radio key={option} label={option} checked={check === option} onCheckedChange={() => setCheck(option)} />
      ))}
    </Stack>
  );
};

export const ButtonRadioes = () => {
  const [check, setCheck] = useState("Hangzhou");
  const options = ["Hangzhou", "Shanghai", "Chengdu", "Beijing"];
  return (
    <Stack inline>
      {map(options, (option) => (
        <ButtonRadio key={option} label={option} checked={check === option} onCheckedChange={() => setCheck(option)} />
      ))}
    </Stack>
  );
};
