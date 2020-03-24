import { selector, themes } from "@querycap-ui/core";
import { Button, Input, InputIcon, InputPrefix, InputSuffix } from "@querycap-ui/form-controls";
import { IconAirplay, IconChevronDown, IconEyeOff } from "@querycap-ui/icons";
import { Stack } from "@querycap-ui/layouts";
import { headings } from "@querycap-ui/texts";
import React from "react";

export const Inputs = () => {
  return (
    <>
      <h2 css={headings.h2}> 输入状态 </h2>
      <Stack spacing={themes.space.s2} css={selector().fontSize(themes.fontSizes.xs)}>
        <Input>
          <input type="text" value={"输入"} />
        </Input>
        <Input active>
          <input type="text" value={"输入"} />
        </Input>
        <Input danger>
          <input type="text" value={"输入"} />
        </Input>
        <Input success>
          <input type="text" value={"输入"} />
        </Input>
        <Input disabled>
          <input type="text" disabled value={"输入"} />
        </Input>
      </Stack>
      <h2 css={headings.h2}> input 套件 </h2>
      <Stack spacing={themes.space.s2} css={selector().fontSize(themes.fontSizes.xs)}>
        <Input>
          <InputPrefix css={selector().fontFamily(themes.fonts.mono)}>https://</InputPrefix>
          <input type="text" placeholder={"www.github.com"} />
        </Input>
        <Input>
          <input type="text" placeholder={"www.github.com"} />
          <InputSuffix css={selector().fontFamily(themes.fonts.mono)}>.com</InputSuffix>
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
        <Input>
          <input type="text" />
          <InputIcon>
            <IconChevronDown />
          </InputIcon>
        </Input>
      </Stack>

      <h2 css={headings.h2}> 与 Button 组合 </h2>
      <Stack spacing={themes.space.s2} css={selector().fontSize(themes.fontSizes.xs)}>
        <Stack inline spacing={themes.space.s1}>
          <Input>
            <input type="text" />
          </Input>
          <Button primary>提交</Button>
        </Stack>
        <Stack inline spacing={themes.space.s1}>
          <Input small>
            <input type="text" />
          </Input>
          <Button primary small>
            提交
          </Button>
        </Stack>
      </Stack>
    </>
  );
};
