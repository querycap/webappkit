import { roundedEm, select } from "@querycap-ui/core";
import { Stack } from "@querycap-ui/layouts";
import { useState } from "react";
import { Step, Steps as StepsDemo } from "../Step";

export const Steps = () => {

    const [step] = useState<number>(2);
    const steps = [
        { title: "步骤1", content: "测试测试" },
        { title: "步骤2", content: "测试测试" },
        { title: "步骤3", content: "测试测试" },
        { title: "步骤4", content: "测试测试" },
    ];
    return <>
        <Stack spacing={roundedEm(6)} align={"stretch"}>
            <StepsDemo current={step}>
                {steps.map(({ title }, index) => (
                    <Step key={index}>
                        <div>
                            {title}
                        </div>
                    </Step>
                ))}
            </StepsDemo>
            <StepsDemo current={step} type={'line'}>
                {steps.map(({ title }, index) => (
                    <Step key={index}>
                        <div>
                            {title}
                        </div>
                    </Step>
                ))}
            </StepsDemo>
            <StepsDemo current={step} type={'card'}>
                {steps.map(({ title, content }, index) => (
                    <Step key={index}>
                        <div >
                            {title}
                        </div>
                        <div css={select().lineHeight('22px').fontSize(12)}>{content}</div>
                    </Step>
                ))}
            </StepsDemo>
        </Stack>
    </>
}