import React from "react";

export interface GraphProps extends React.HTMLAttributes<any> {
  inline?: boolean;
}

export const Graph = ({ children, inline, ...otherProps }: GraphProps) => {
  return (
    <span
      {...otherProps}
      role={"icon"}
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

export const Icon = ({ inline = true, children, ...props }: GraphProps) => (
  <Graph
    {...props}
    inline={inline}
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

export const createIcon = (svg: React.ReactElement) => (props: GraphProps) => <Icon {...props}>{svg}</Icon>;
