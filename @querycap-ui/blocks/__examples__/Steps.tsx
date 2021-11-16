import { useState } from "react";
import { Step, Steps as StepsDemo } from "../Step";

export const Steps = () => {

    const [step] = useState<number>(2);
    const steps = [
        { title: "计算指纹", content: "正在抽取数据元信息，计算数字指纹" },
        { title: "区块链共识", content: "正在对上链信息进行验证，并进行共识计算" },
        { title: "区块链排序", content: "共识认证通过，正在对该上链行为进行排序，等待出块" },
        { title: "上链成功", content: "出块成功，上链成功，3秒后该窗口关闭" },
    ];
    return <>
        <StepsDemo current={step}>
            {steps.map(({ title }, index) => (
                <Step key={index}>
                    <div>
                        {title}
                    </div>
                </Step>
            ))}
        </StepsDemo>
    </>
}