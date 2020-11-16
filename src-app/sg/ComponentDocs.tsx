import {
  colors,
  cover,
  rgba,
  roundedEm,
  select,
  shadows,
  theme,
  ThemeState,
  withBackground,
} from "@querycap-ui/core/macro";
import { Switch } from "@querycap-ui/form-controls";
import { Stack } from "@querycap-ui/layouts";
import { IRoute, NavLink, parseSearchString, Redirect, useRouter } from "@reactorx/router";
import { filter, groupBy, keys, last, map, noop } from "lodash";
import { ReactNode } from "react";
import { CSSReset } from "src-app/sg/Reset";
import { CodeBlock } from "./CodeBlock";

import { examples, IExample } from "./exmaple";

const ExampleSection = ({ children }: { children?: ReactNode }) => (
  <div
    css={select()
      .position("relative")
      .padding(roundedEm(1.2))
      .with(select("& + &").marginTop(roundedEm(0.4)))}>
    {children}
  </div>
);

const ExampleBlock = ({ name, module, group, source, examples }: IExample) => {
  return (
    <div
      css={select()
        .position("relative")
        .backgroundColor(theme.state.backgroundColor)
        .color(theme.state.color)
        .paddingY(roundedEm(1.5))
        .paddingX(roundedEm(1.2))
        .with(select("& + &").borderTopWidth(1).borderTopStyle("solid").borderColor(theme.state.borderColor))}>
      <div
        css={select()
          .position("absolute")
          .top(0)
          .right(0)
          .paddingX(roundedEm(1.2))
          .paddingY(roundedEm(0.6))
          .fontSize(theme.fontSizes.s)
          .opacity(0.3)}>
        {group}/{module}/{name}
      </div>
      <Stack inline spacing={roundedEm(0.6)}>
        <div
          css={select()
            .flex(1)
            .borderWidth(1)
            .borderStyle("solid")
            .borderRadius(theme.radii.normal)
            .borderColor(theme.state.borderColor)}>
          {map(examples, (Example, key) => (
            <ExampleSection key={key}>
              <Example />
            </ExampleSection>
          ))}
        </div>
        {!!source && (
          <div css={select().borderBottomRadius(theme.radii.normal).fontSize("0.6em").width("30%")}>
            <CodeBlock>{source}</CodeBlock>
          </div>
        )}
      </Stack>
    </div>
  );
};

const Sidebar = withBackground(colors.gray9)(({ group, examples }: { group: string; examples: IExample[] }) => {
  const { location } = useRouter();

  return (
    <ul
      css={select()
        .padding(roundedEm(0.9))
        .fontSize(theme.fontSizes.s)
        .backgroundColor(theme.state.backgroundColor)
        .color(theme.state.color)
        .lineHeight(theme.lineHeights.normal)
        .position("relative")
        .width(260)
        .margin(0)
        .overflowX("hidden")
        .overflowY("auto")
        .listStyle("none")
        .with(
          select("& ul")
            .color("inherit")
            .paddingLeft(roundedEm(0.3))
            .paddingY(roundedEm(0.3))
            .margin(0)
            .listStyle("none"),
        )
        .with(
          select("& a")
            .color("inherit")
            .textDecoration("none")
            .opacity(0.8)
            .paddingY(roundedEm(0.3))
            .with(select("&:hover", "&[data-current=true]").opacity(1)),
        )}>
      {map(
        groupBy(examples, (e) => e.module),
        (examples, module) => (
          <li key={module}>
            <NavLink to={`/${group}/${module}${location.search}`}>
              <div css={select().display("flex").alignItems("center").justifyContent("space-between")}>
                <div>{`${group}/${module}`}</div>
                <img
                  style={{
                    height: "0.8em",
                  }}
                  src={`//img.shields.io/npm/v/${group}/${module}.svg?style=flat-square`}
                />
              </div>
            </NavLink>
            <ul>
              {map(examples, (e) => (
                <li key={e.name}>
                  <NavLink to={`/${group}/${module}/${e.name}${location.search}`}>{e.name}</NavLink>
                </li>
              ))}
            </ul>
          </li>
        ),
      )}
    </ul>
  );
});

const List = ({ filterBy }: { filterBy: { group?: string; module?: string; name?: string } }) => {
  const matched =
    filterBy.group || filterBy.module || filterBy.name
      ? filter(examples, (e) => {
        if (filterBy.name) {
          return e.group === filterBy.group && e.module === filterBy.module && e.name === filterBy.name;
        }
        if (filterBy.module) {
          return e.group === filterBy.group && e.module === filterBy.module;
        }
        return e.group === filterBy.group;
      })
      : examples;

  return (
    <>
      {map(matched, (ex) => {
        return <ExampleBlock key={`${ex.group}:${ex.module}:${ex.name}`} {...ex} />;
      })}
    </>
  );
};

const Nav = withBackground(colors.gray9)(({ groups }: { groups: string[] }) => {
  const { location } = useRouter();
  const { dark } = parseSearchString(location.search);

  return (
    <Stack
      inline
      justify={"flex-end"}
      spacing={roundedEm(0.9)}
      css={select()
        .paddingX(roundedEm(0.9))
        .fontSize(theme.fontSizes.s)
        .position("relative")
        .zIndex(10)
        .boxShadow(shadows.medium)
        .paddingY(roundedEm(0.6))
        .backgroundColor(theme.state.backgroundColor)
        .color(theme.state.color)
        .with(select("& a").color(theme.state.color).textDecoration("none"))}>
      {map(groups, (g) => (
        <NavLink key={g} to={`/${g}${location.search}`}>
          {g}
        </NavLink>
      ))}

      <NavLink key={"toggle"} to={dark ? `${location.pathname}` : `${location.pathname}?dark=1`}>
        <Switch value={!!dark} onValueChange={noop} />
      </NavLink>
    </Stack>
  );
});

const ComponentDocsMain = ({ match }: IRoute<{ group?: string; module?: string; name?: string }>) => {
  const groups = groupBy(examples, (e) => e.group);

  return (
    <Stack
      align={"stretch"}
      css={select().with(cover()).zIndex(1).backgroundColor(theme.state.backgroundColor).color(theme.state.color)}>
      <Nav groups={keys(groups)} />
      <Stack inline align={"stretch"} css={{ flex: 1, overflow: "hidden" }}>
        {match.params.group ? (
          <>
            <Sidebar group={match.params.group} examples={groups[match.params.group]} />
            <div css={select().flex(1).position("relative").overflowX("hidden").overflowY("auto")}>
              <List filterBy={match.params} />
            </div>
          </>
        ) : (
          <Redirect to={`/${last(keys(groups))}`} />
        )}
      </Stack>
    </Stack>
  );
};

export const ComponentDocs = (props: IRoute<{ group?: string; module?: string; name?: string }>) => {
  const { location } = useRouter();
  const { dark } = parseSearchString(location.search);

  return (
    <ThemeState
      root
      borderColor={dark ? rgba(colors.gray2, 0.15) : theme.state.borderColor}
      color={dark ? colors.gray2 : theme.state.color}
      backgroundColor={dark ? colors.gray8 : theme.state.backgroundColor}>
      <CSSReset />
      <ComponentDocsMain {...props} />
    </ThemeState>
  );
};
