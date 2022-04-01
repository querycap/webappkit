import { preventDefault, select, roundedEm, stopPropagation, theme } from "@querycap-ui/core";
import { pipe } from "rxjs";
import { map } from "@querycap/lodash";
import { Children, isValidElement, ReactElement, ReactNode, useEffect, useState } from "react";
import { parseSearchString, toSearchString, useRouter } from "@reactorx/router";

export interface TabProps {
  name: string;
  title: ReactNode;
  children?: ReactNode;
}

export const Tab = (_: TabProps) => null;

export const Tabs = ({
  defaultActive,
  children,
  cacheKey,
}: {
  defaultActive?: string;
  children: Array<ReactElement<TabProps>>;
  cacheKey?: string;
}) => {
  const { location, history } = useRouter();
  const query = parseSearchString(location.search);

  const [state, setState] = useState<{
    tabs: { [k: string]: TabProps };
    orders: string[];
    active: string;
  }>({ orders: [], tabs: {}, active: cacheKey && query[cacheKey] ? query[cacheKey] : defaultActive || "" });

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

  useEffect(() => {
    if (cacheKey) {
      history.replace({
        search: toSearchString({
          ...query,
          [cacheKey]: state.active,
        }),
      });
    }
  }, [state.active]);

  return (
    <div css={select().position("relative").fontSize(theme.state.fontSize)}>
      <div
        css={select()
          .display("flex")
          .borderBottom("1px solid")
          .borderColor(theme.state.borderColor)
          .with(select("& > * + *").marginLeft(roundedEm(0.6)))
          .with(
            select("& > *")
              .position("relative")
              .paddingY(roundedEm(0.6))
              .color("inherit")
              .textDecoration("none")
              .with(
                select("&[data-current=true]:before")
                  .content('""')
                  .position("absolute")
                  .left(0)
                  .bottom(-1)
                  .height(2)
                  .right(0)
                  .backgroundColor(theme.colors.primary),
              )
              .with(select("&[data-current=true]").color(theme.colors.primary)),
          )}
      >
        {map(state.orders, (name) => {
          return (
            <a
              key={name}
              data-current={name === state.active}
              href={"#"}
              onClick={pipe(stopPropagation, preventDefault, () => {
                setState((state) => ({
                  ...state,
                  active: name,
                }));
              })}
            >
              {state.tabs[name].title}
            </a>
          );
        })}
      </div>
      <div>{state.tabs[state.active]?.children}</div>
    </div>
  );
};
