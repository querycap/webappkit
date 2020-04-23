import { roundedEm } from "@querycap-ui/core/macro";
import { Button, ButtonGroup } from "@querycap-ui/form-controls";
import { Stack } from "@querycap-ui/layouts";
import React from "react";

export const ButtonGroups = () => {
  return (
    <Stack spacing={roundedEm(0.6)}>
      <ButtonGroup small>
        <Button primary>Button</Button>
        <Button>Button</Button>
        <Button>Button</Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button>Button</Button>
        <Button primary>Button</Button>
        <Button>Button</Button>
      </ButtonGroup>
    </Stack>
  );
};
