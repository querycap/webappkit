import { useState } from "react";
import { times } from "lodash";
import { headings } from "../../texts/utils";
import { Stack } from "../../layouts/Stack";
import { roundedEm, theme } from "../../core/theme";
import { select } from "../../core/select";
import { Input } from "../Input";
import { InputSelect } from "../InputSelect";

export const InputSelects = () => {
  const [value, setValue] = useState(undefined);
  const [count, setCount] = useState("");

  const enums = [
    "<span style='color:red'>Apple<span style='font-size:14px;color:green'>苹果</span></span>",
    "Orange",
    "Banana",
  ];

  const moreEnums = times(50);

  return (
    <>
      <h2 css={headings.h2}> 选择器 </h2>
      <Stack spacing={roundedEm(0.6)} css={select().fontSize(theme.fontSizes.xs)}>
        <div css={select().position("relative")}>
          <Input small>
            <InputSelect allowClear enum={enums} value={value || ""} onValueChange={setValue} name={"select"} />
          </Input>
        </div>
      </Stack>

      <h2 css={headings.h2}> 选择器滚动 </h2>
      <Stack spacing={roundedEm(0.6)} css={select().fontSize(theme.fontSizes.xs)}>
        <div css={select().position("relative")}>
          <Input>
            <InputSelect allowClear enum={moreEnums} value={count} onValueChange={setCount} name={"select"} />
          </Input>
        </div>
      </Stack>
    </>
  );
};
