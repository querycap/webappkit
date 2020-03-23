import { selector, themes } from "@querycap-ui/core";
import { Stack } from "@querycap-ui/layouts";
import { Progress } from "@querycap-ui/progresses";
import React from "react";

export const Progresses = () => (
  <Stack spacing={themes.space.s2} align={"stretch"}>
    <div>
      <Progress height={4}>
        <div css={selector().backgroundColor(themes.colors.primary)} style={{ width: "20%" }} />
      </Progress>
    </div>
    <div css={{ textDecoration: "underline" }}>
      <span>完成度 2 of 4 </span>
      <Progress height={4} inline css={selector().verticalAlign("0.25em")}>
        <div css={selector().backgroundColor(themes.colors.primary)} style={{ width: "50%" }} />
      </Progress>
    </div>
  </Stack>
);
