import React from "react";

export interface IGraphProps extends React.HTMLAttributes<any> {
  inline?: boolean;
}

export type IIconProps = IGraphProps;

export const Graph = ({ children, inline, ...otherProps }: IGraphProps) => {
  return (
    <span
      {...otherProps}
      css={[
        {
          alignItems: "center",
          verticalAlign: "middle",
          lineHeight: "inherit",
          "& > svg": {
            width: "100%",
            height: "auto",
          },
        },
        { display: inline ? "inline-flex" : "flex" },
      ]}>
      {children}
    </span>
  );
};

export const Icon = ({ children, ...props }: IGraphProps) => (
  <Graph
    {...props}
    css={{
      "& > svg": {
        display: "block",
        flex: 1,
        boxSizing: "border-box",
        width: "1em",
        fontSize: "1em",
        height: "1em",
        fill: "inherit",
      },
    }}>
    {children}
  </Graph>
);

export const createIcon = (svg: React.ReactElement) => (props: IGraphProps) => <Icon {...props}>{svg}</Icon>;
