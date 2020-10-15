import { select, theme, roundedEm } from "@querycap-ui/core/macro";
import { Button, Input, InputIcon, InputPrefix, InputSelect, InputSuffix } from "@querycap-ui/form-controls";
import { IconAirplay, IconEyeOff } from "@querycap-ui/icons";
import { Stack } from "@querycap-ui/layouts";
import { headings } from "@querycap-ui/texts";
import  { useState } from "react";
import { times } from "lodash";

export const Inputs = () => {
  const [value, setValue] = useState("");

  const enums = times(50);

  return (
    <>
      <h2 css={headings.h2}> 输入状态 </h2>
      <Stack spacing={roundedEm(0.6)} css={select().fontSize(theme.fontSizes.xs)}>
        <Input>
          <input type="text" />
        </Input>
        <Input small active>
          <input type="text" value={"输入中"} readOnly />
        </Input>
        <Input small danger>
          <input type="text" value={"输入错误"} readOnly />
        </Input>
        <Input small success>
          <input type="text" value={"输入成功"} readOnly />
        </Input>
        <Input small disabled>
          <input type="text" disabled value={"输入静止"} />
        </Input>
      </Stack>
      <h2 css={headings.h2}> input 套件 </h2>
      <Stack spacing={roundedEm(0.6)} css={select().fontSize(theme.fontSizes.xs)}>
        <Input>
          <InputPrefix css={select().fontFamily(theme.fonts.mono)}>https://</InputPrefix>
          <input type="text" placeholder={"www.github.com"} />
        </Input>
        <Input>
          <input type="text" placeholder={"www.github.com"} />
          <InputSuffix css={select().fontFamily(theme.fonts.mono)}>.com</InputSuffix>
        </Input>
        <Input>
          <InputIcon>
            <IconAirplay />
          </InputIcon>
          <input type="text" />
        </Input>
        <Input>
          <input type="text" />
          <InputIcon>
            <IconEyeOff />
          </InputIcon>
        </Input>
      </Stack>

      <h2 css={headings.h2}> 与 Button 组合 </h2>
      <Stack spacing={roundedEm(0.6)} css={select().fontSize(theme.fontSizes.xs)}>
        <Stack inline spacing={roundedEm(0.3)}>
          <Input>
            <input type="text" />
          </Input>
          <Button primary>提交</Button>
        </Stack>
        <Stack inline spacing={roundedEm(0.3)}>
          <Input small>
            <input type="text" />
          </Input>
          <Button primary small>
            提交
          </Button>
        </Stack>
      </Stack>

      <h2 css={headings.h2}> Input Select </h2>
      <Stack spacing={roundedEm(0.6)} css={select().fontSize(theme.fontSizes.xs)}>
        <div css={select().position("relative")}>
          <Input>
            <InputSelect allowClear enum={enums} value={value} onValueChange={setValue} name={"select"} />
          </Input>
        </div>
      </Stack>
    </>
  );
};
