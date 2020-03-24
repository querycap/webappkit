import { Dialog, DialogAlert, DialogPrompt } from "@querycap-ui/blocks";
import { selector, themes } from "@querycap-ui/core";
import { Button } from "@querycap-ui/form-controls";
import { IconCheckCircle } from "@querycap-ui/icons";
import { Stack } from "@querycap-ui/layouts";
import React from "react";

export const Dialogs = () => {
  return (
    <Stack spacing={themes.space.s4}>
      <Dialog title={"对话框"} onRequestClose={console.log} onRequestConfirm={console.log}>
        文字描述
      </Dialog>
      <DialogPrompt onRequestClose={console.log} onRequestConfirm={console.log}>
        是否确定
      </DialogPrompt>
      <DialogAlert onRequestClose={console.log}>
        <Stack align={"center"} spacing={themes.space.s2}>
          <div
            css={selector().colorFill(themes.colors.success).lineHeight(themes.lineHeights.condensed).fontSize("5em")}>
            <IconCheckCircle />
          </div>
          <div css={selector().textAlign("center").lineHeight(themes.lineHeights.condensed)}>
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
    </Stack>
  );
};
