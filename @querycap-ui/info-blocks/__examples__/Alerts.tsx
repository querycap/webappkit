import { themes } from "@querycap-ui/core";
import { Alert } from "@querycap-ui/info-blocks";
import { Stack } from "@querycap-ui/layouts";
import React from "react";

export const Alerts = () => {
  return (
    <Stack spacing={themes.space.s2} align={"stretch"}>
      <Alert
        type={"info"}
        onRequestClose={() => {
          //
        }}>
        提示信息
      </Alert>
      <Alert
        type={"success"}
        onRequestClose={() => {
          //
        }}>
        提示信息
      </Alert>
      <Alert
        type={"error"}
        onRequestClose={() => {
          //
        }}>
        提示信息
      </Alert>
      <Alert
        type={"warning"}
        onRequestClose={() => {
          //
        }}>
        提示信息
      </Alert>
    </Stack>
  );
};
