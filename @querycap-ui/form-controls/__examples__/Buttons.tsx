import { select, theme } from "@querycap-ui/core/macro";
import { Button } from "@querycap-ui/form-controls";
import { IconCamera } from "@querycap-ui/icons";
import { Stack } from "@querycap-ui/layouts";
import { headings } from "@querycap-ui/texts";
import React from "react";

export const Buttons = () => {
  return (
    <>
      <h2 css={headings.h2}>普通按钮</h2>
      <Stack spacing={theme.space.s2}>
        <Stack inline spacing={theme.space.s2}>
          <Button type="button" primary>
            主按钮
          </Button>
          <Button type="button" primary disabled>
            主按钮
          </Button>
        </Stack>
        <Stack inline spacing={theme.space.s2}>
          <Button type="button">按钮</Button>
          <Button type="button" disabled>
            按钮
          </Button>
        </Stack>
        <div css={{ width: "100%" }}>
          <Button type="button" primary block>
            按钮
          </Button>
        </div>
      </Stack>
      <h2 css={headings.h2}>小按钮</h2>
      <Stack spacing={theme.space.s2} css={select().fontSize(theme.fontSizes.xs)}>
        <Stack inline spacing={theme.space.s2}>
          <Button type="button" primary small>
            主按钮
          </Button>
          <Button type="button" primary small disabled>
            主按钮
          </Button>
        </Stack>
        <Stack inline spacing={theme.space.s2}>
          <Button type="button" small>
            按钮
          </Button>
          <Button type="button" small disabled>
            按钮
          </Button>
        </Stack>
      </Stack>
      <h2 css={headings.h2}>隐形按钮</h2>
      <Stack inline spacing={0}>
        <Button type="button" invisible>
          取消
        </Button>
        <Button type="button" primary>
          确定
        </Button>
      </Stack>
      <h2 css={headings.h2}> 和 Icon 搭配使用</h2>
      <Stack spacing={theme.space.s2} css={select().fontSize(theme.fontSizes.xs)}>
        <Stack inline spacing={theme.space.s2}>
          <Button type="button" primary small>
            <IconCamera />
            <span>主按钮</span>
          </Button>
          <Button type="button" primary small disabled>
            <IconCamera />
            <span>主按钮</span>
          </Button>
        </Stack>
        <Stack inline spacing={theme.space.s2}>
          <Button type="button" small>
            <IconCamera />
            <span>按钮</span>
          </Button>
          <Button type="button" small disabled>
            <IconCamera />
            <span>按钮</span>
          </Button>
        </Stack>
      </Stack>
    </>
  );
};
