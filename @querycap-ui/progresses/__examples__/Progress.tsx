import { select, theme } from "@querycap-ui/core/macro";
import { Stack } from "@querycap-ui/layouts";
import { Progress } from "@querycap-ui/progresses";
import React from "react";

export const Progresses = () => (
  <Stack spacing={theme.space.s2} align={"stretch"}>
    <div>
      <Progress height={4}>
        <div css={select().backgroundColor(theme.colors.primary)} style={{ width: "20%" }} />
      </Progress>
    </div>
    <div css={{ textDecoration: "underline" }}>
      <span>完成度 2 of 4 </span>
      <Progress height={4} inline css={select().verticalAlign("0.25em")}>
        <div css={select().backgroundColor(theme.colors.primary)} style={{ width: "50%" }} />
      </Progress>
    </div>
  </Stack>
);
