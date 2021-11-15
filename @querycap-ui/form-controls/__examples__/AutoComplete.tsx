import { useState } from "react";
import { select } from "../../core/select";
import { roundedEm, theme } from "../../core/theme";
import { Stack } from "../../layouts/Stack";
import { headings } from "../../texts/utils";
import { AutoComplete } from "../AutoComplete";
import { Input } from "../Input";

export const AutoCompletes = () => {
    const [value, setValue] = useState();

    const enums = [
        {
            label: '是',
            value: true
        },
        {
            label: '否',
            value: false
        }];
    return (
        <>
            <h2 css={headings.h2}> autoComplete </h2>
            <Stack spacing={roundedEm(0.6)} css={select().fontSize(theme.fontSizes.xs)}>
                <div css={select().position("relative")}>
                    <Input small>
                        <AutoComplete allowClear enum={enums} value={value} onValueChange={(val) => { 
                            setValue(val) }} name={"autocomplete"} />
                    </Input>
                </div>
            </Stack>
        </>
    );
};
