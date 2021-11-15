import { select, theme, roundedEm } from "@querycap-ui/core/macro";
import { Button } from "@querycap-ui/form-controls";
import { IconCamera } from "@querycap-ui/icons";
import { Stack } from "@querycap-ui/layouts";
import { headings } from "@querycap-ui/texts";

export const Buttons = () => {
  return (
    <>
      <h2 css={headings.h2}>普通按钮</h2>
      <Stack spacing={roundedEm(0.6)}>
        <Stack inline spacing={roundedEm(0.6)}>
          <Button type="button" primary>
            主按钮
          </Button>
          <Button type="button" primary disabled>
            主按钮
          </Button>
        </Stack>
        <Stack inline spacing={roundedEm(0.6)}>
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
      <h2 css={headings.h2}>按钮尺寸</h2>
      <Stack spacing={roundedEm(0.6)}>
        <Stack inline spacing={roundedEm(0.6)}>
          <div>
            <Button type="button" primary size={"LARGE"}>
              大按钮
            </Button>
          </div>
          <div>
            <Button type="button" primary size={"MEDIUM"}>
              中按钮
            </Button>
          </div>
          <div>
            <Button type="button" primary size={"SMALL"}>
              小按钮
            </Button>
          </div>
          <div>
            <Button type="button" size={"LARGE"}>
              大按钮
            </Button>
          </div>
          <div>
            <Button type="button" size={"MEDIUM"}>
              中按钮
            </Button>
          </div>
          <div>
            <Button type="button" size={"SMALL"}>
              小按钮
            </Button>
          </div>
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
      <Stack spacing={roundedEm(0.6)} css={select().fontSize(theme.fontSizes.xs)}>
        <Stack inline spacing={roundedEm(0.6)}>
          <Button type="button" primary small>
            <IconCamera />
            <span>主按钮</span>
          </Button>
          <Button type="button" primary small disabled>
            <IconCamera />
            <span>主按钮</span>
          </Button>
        </Stack>
        <Stack inline spacing={roundedEm(0.6)}>
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
