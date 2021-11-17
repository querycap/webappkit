import { colors, select, transparentize } from "@querycap-ui/core";
import { Children, ComponentType, ReactNode } from "react";


export interface StepsProp {
    type?: "default" | "card" | "line";
    children?: any[];
    current?: number
}

export const Steps = ({ current = 0, type = 'default', children = [], ...otherProps }: StepsProp) => {
    return <div {...otherProps} css={select().display('flex')}>
        {Children.map(children, (child: any, idx) => {
            const { children: content, ...otherProps } = child.props;
            if (type == 'line') {
                return <div css={[
                    select().minWidth(142).borderBottom('4px solid').borderColor(t => t.state.borderColor).marginRight(t => t.radii.normal),
                    current >= idx && select().borderColor(t => t.colors.primary)
                ]}>
                    <div css={[select().marginBottom(12),
                    idx <= current && select().color(t => t.colors.primary)
                    ]}>{content}</div>
                </div>
            }
            if (type == 'card') {
                return <div css={[
                    select().minWidth(180).minHeight(60).padding(12).margin(t => t.radii.normal),
                    idx < current && select().backgroundColor(t => transparentize(0.85, t.colors.success)).color(t => t.colors.success),
                    idx == current && select().backgroundColor(t => t.colors.primary).color('#fff'),
                    idx > current && select().backgroundColor(colors.gray1).color(t => t.state.color)
                ]}>
                    {content}
                </div>
            }

            return <div>
                <div key={idx} css={select().display('flex').alignItems('center').position('relative')}>
                    <StepIcon isActive={current >= idx} {...otherProps} >
                        {idx + 1}
                    </StepIcon>
                    {idx < children.length - 1 &&
                        <StepTail active={idx <= current - 1}></StepTail>
                    }
                </div>
                <StepContent>{content}</StepContent>
            </div>
        })}
    </div>
}

export const Step = (_: { children: ReactNode; Icon?: ComponentType<any> }) => {
    return null;
}

const StepIcon = ({ isActive, children, ...otherProps }: { isActive: boolean; children: ReactNode }) => {

    return (
        <div
            {...(otherProps)}
            css={[
                select().fontSize(20).borderRadius('50%').color('#fff').background(t => t.state.borderColor).display("flex").justifyContent('center').alignItems('center').width(30).height(30),
                isActive && select().backgroundColor(t => t.colors.primary)
            ]}
        >
            {children}
        </div>
    );
};

const StepContent = ({ children }: { children: ReactNode }) => {
    return (
        <div
            css={select().marginTop('0.5rem')}>
            {children}
        </div>
    );
};

const StepTail = ({ active }: { active?: boolean }) => {
    return (
        <div
            css={
                [select().flex(1).height(1).background(t => t.state.borderColor).minWidth(100)
                    // .position('absolute').left('50%').right('-50%')
                    ,
                active && select().backgroundColor(t => t.colors.primary)]
            }></div>
    );
};