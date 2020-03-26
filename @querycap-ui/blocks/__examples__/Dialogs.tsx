import { Dialog, DialogAlert, DialogPrompt, Tab, Tabs } from "@querycap-ui/blocks";
import { select, theme } from "@querycap-ui/core/macro";
import { Button } from "@querycap-ui/form-controls";
import { IconCheckCircle } from "@querycap-ui/icons";
import { Stack } from "@querycap-ui/layouts";
import React from "react";

export const Dialogs = () => {
  return (
    <Stack spacing={theme.space.s4}>
      <Dialog title={"对话框"} onRequestClose={console.log} onRequestConfirm={console.log}>
        文字描述
      </Dialog>
      <DialogPrompt onRequestClose={console.log} onRequestConfirm={console.log}>
        是否确定
      </DialogPrompt>
      <DialogAlert onRequestClose={console.log}>
        <Stack align={"center"} spacing={theme.space.s2}>
          <div css={select().colorFill(theme.colors.success).lineHeight(theme.lineHeights.condensed).fontSize("5em")}>
            <IconCheckCircle />
          </div>
          <div css={select().textAlign("center").lineHeight(theme.lineHeights.condensed)}>
            <h2 style={{ margin: 0 }}>xxxxxx</h2>
            <p>xxxxxxxxxxxxxxxxxxxxxx</p>
          </div>
          <div style={{ width: "50%" }}>
            <Button block primary>
              确定
            </Button>
          </div>
        </Stack>
      </DialogAlert>

      <DialogAlert onRequestClose={console.log}>
        <Tabs>
          <Tab name={"sms"} title={"短信验证"}>
            <div css={select().paddingTop(theme.space.s2)}>1111</div>
          </Tab>
          <Tab name={"password"} title={"密码验证"}>
            <div css={select().paddingTop(theme.space.s2)}>2222</div>
          </Tab>
        </Tabs>
      </DialogAlert>
    </Stack>
  );
};
