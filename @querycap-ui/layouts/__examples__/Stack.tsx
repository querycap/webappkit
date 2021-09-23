import { roundedEm, select, theme } from "@querycap-ui/core";
import { Stack } from "@querycap-ui/layouts";
import { times } from "lodash";

const children = times(5).map((_, i) => (
  <div key={i} css={select().backgroundColor(theme.colors.warning).width(roundedEm(5)).height(roundedEm(2))} />
));

export const Stacks = () => {
  return (
    <Stack spacing={roundedEm(3)}>
      <Stack spacing={roundedEm(1)}>{children}</Stack>
      <Stack inline wrap="wrap" spacing={roundedEm(1)}>
        {children}
      </Stack>
    </Stack>
  );
};
