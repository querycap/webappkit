import { useState } from "react";
import { headings } from "../../texts/utils";
import { Stack } from "../../layouts/Stack";
import { roundedEm, theme } from "../../core/theme";
import { select } from "../../core/select";
import { Input } from "../Input";
import { TextArea } from "../TextArea";

export const TextAreas = () => {
  const [value, setValue] = useState("");

  return (
    <>
      <h2 css={headings.h2}> 文本域 </h2>
      <Stack spacing={roundedEm(0.6)} css={select().fontSize(theme.fontSizes.xs)}>
        <div css={select().position("relative")}>
          <Input small>
            <TextArea value={value || ""} onValueChange={setValue} />
          </Input>
        </div>
      </Stack>
    </>
  );
};
