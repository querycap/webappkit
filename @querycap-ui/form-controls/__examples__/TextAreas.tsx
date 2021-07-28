import { useState } from "react";
import { headings } from "@querycap-ui/texts";
import { Stack } from "@querycap-ui/layouts";
import { select } from "@querycap-ui/core";
import { roundedEm, theme } from "@querycap-ui/core";
import { Input, TextArea } from "@querycap-ui/form-controls";

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
