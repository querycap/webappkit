import React from "react";

export interface GraphProps extends React.HTMLAttributes<any> {
  inline?: boolean;
  scale?: number;
}

export const Graph = ({ children, scale = 1, inline, ...otherProps }: GraphProps) => {
  return (
    <span
      {...otherProps}
      role={"img"}
      css={[
        {
          alignItems: "center",
          lineHeight: "inherit",
          textRendering: "optimizeLegibility",
          position: "relative",
        },
        {
          "& > svg": {
            width: "100%",
            height: "auto",
          },
        },
        {
          "& > svg": {
            transform: `scale(${scale})`,
          },
        },
        inline
          ? {
              display: "inline-flex",
            }
          : {
              display: "flex",
            },
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
      "&[role=img] > svg": {
        display: "block",
        flex: 1,
        boxSizing: "border-box",
        width: "1em",
        fontSize: "1em",
        height: "1em",
        position: "relative",
        top: ".125em",
        fill: "inherit",
      },
    }}>
    {children}
  </Graph>
);

export const createIcon = (svg: React.ReactElement) => (props: GraphProps) => <Icon {...props}>{svg}</Icon>;
