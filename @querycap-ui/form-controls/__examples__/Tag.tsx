import { colors } from "@querycap-ui/core";
import { Stack } from "@querycap-ui/layouts/Stack";
import { Tag } from "../Tag";

export const Tags = () => {
  return (
    <Stack inline spacing={20}>
      <Tag>Tag 1</Tag>
      <Tag closable>Tag 2</Tag>
      <Tag color={colors.green5}>Green</Tag>
      <Tag color={colors.red5}>Red</Tag>
      <Tag color={colors.purple5} isChecked={false}>
        UnChecked
      </Tag>
    </Stack>
  );
};
