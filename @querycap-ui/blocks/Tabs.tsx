import { selector, themes } from "@querycap-ui/core";
import { map } from "lodash";
import React, { Children, isValidElement, ReactElement, ReactNode, useEffect, useState } from "react";

export interface TabProps {
  name: string;
  title: ReactNode;
  children?: ReactNode;
}

export const Tab = (_: TabProps) => null;

export const Tabs = ({
  defaultActive,
  children,
}: {
  defaultActive?: string;
  children: Array<ReactElement<TabProps>>;
}) => {
  const [state, setState] = useState<{
    tabs: { [k: string]: TabProps };
    orders: string[];
    active: string;
  }>({ orders: [], tabs: {}, active: defaultActive || "" });

  useEffect(() => {
    const tabs: { [k: string]: TabProps } = {};
    const orders: string[] = [];

    Children.forEach(children, (item) => {
      if (isValidElement<TabProps>(item)) {
        tabs[item.props.name] = item.props;
        orders.push(item.props.name);
      }
    });

    setState((state) => ({
      active: tabs[state.active] ? state.active : orders[0],
      tabs: tabs,
      orders: orders,
    }));
  }, children);

  return (
    <div css={selector().position("relative").fontSize(themes.state.fontSize)}>
      <div
        css={selector()
          .display("flex")
          .borderBottom("1px solid")
          .borderColor(themes.state.borderColor)
          .with(selector("& > * + *").marginLeft(themes.space.s2))
          .with(
            selector("& > *")
              .position("relative")
              .paddingY(themes.space.s2)
              .color("inherit")
              .textDecoration("none")
              .with(
                selector("&[data-current=true]:before")
                  .content('""')
                  .position("absolute")
                  .left(0)
                  .bottom(-1)
                  .height(2)
                  .right(0)
                  .backgroundColor(themes.colors.primary),
              )
              .with(selector("&[data-current=true]").color(themes.colors.primary)),
          )}>
        {map(state.orders, (name) => {
          return (
            <a
              key={name}
              data-current={name === state.active}
              href={"#"}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                setState((state) => ({
                  ...state,
                  active: name,
                }));
              }}>
              {state.tabs[name].title}
            </a>
          );
        })}
      </div>
      <div>{state.tabs[state.active]?.children}</div>
    </div>
  );
};
