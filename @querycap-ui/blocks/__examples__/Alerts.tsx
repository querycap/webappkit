import { roundedEm } from "@querycap-ui/core/macro";
import { Alert, AlertCard } from "@querycap-ui/blocks";
import { Stack } from "@querycap-ui/layouts";


export const Alerts = () => {
  return (
    <Stack spacing={roundedEm(0.6)} align={"stretch"}>
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

export const AlertCards = () => {
  return (
    <Stack spacing={roundedEm(0.6)} align={"stretch"}>
      <AlertCard
        type={"info"}
        onRequestClose={() => {
          //
        }}>
        提示信息
      </AlertCard>
      <AlertCard
        type={"success"}
        onRequestClose={() => {
          //
        }}>
        提示信息
      </AlertCard>
      <AlertCard
        type={"error"}
        onRequestClose={() => {
          //
        }}>
        提示信息
      </AlertCard>
      <AlertCard
        type={"warning"}
        onRequestClose={() => {
          //
        }}>
        提示信息
      </AlertCard>
    </Stack>
  );
};
