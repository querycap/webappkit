import { cover, selector, themes, withBackground } from "@querycap-ui/core";
import { Stack } from "@querycap-ui/layouts";
import { IRoute, NavLink } from "@reactorx/router";
import { filter, groupBy, map } from "lodash";
import React, { ReactNode } from "react";
import { CodeBlock } from "./CodeBlock";

import { examples, IExample } from "./exmaple";

const ExampleSection = ({ children }: { children?: ReactNode }) => (
  <div
    css={selector().position("relative").padding(themes.space.s4).with(selector("& + &").marginTop(themes.space.s4))}>
    {children}
  </div>
);

const ExampleBlock = ({ name, module, group, source, examples }: IExample) => {
  return (
    <div
      css={selector()
        .position("relative")
        .paddingY(themes.space.s5)
        .paddingX(themes.space.s4)
        .with(selector("& + &").borderWidth(1).borderStyle("solid").borderColor(themes.state.borderColor))}>
      <div
        css={selector()
          .position("absolute")
          .top(0)
          .right(0)
          .paddingX(themes.space.s4)
          .paddingY(themes.space.s2)
          .fontSize(themes.fontSizes.s)
          .opacity(0.3)}>
        {group}/{module}/{name}
      </div>
      <Stack inline spacing={themes.space.s2}>
        <div
          css={selector()
            .flex(1)
            .borderWidth(1)
            .borderStyle("solid")
            .borderRadius(themes.radii.normal)
            .borderColor(themes.state.borderColor)}>
          {map(examples, (Example, key) => (
            <ExampleSection key={key}>
              <Example />
            </ExampleSection>
          ))}
        </div>
        {!!source && (
          <div css={selector().borderBottomRadius(themes.radii.normal).fontSize("0.6em").width("30%")}>
            <CodeBlock>{source}</CodeBlock>
          </div>
        )}
      </Stack>
    </div>
  );
};

const Sidebar = withBackground(themes.colors.gray9)(() => (
  <ul
    css={selector()
      .padding(themes.space.s3)
      .fontSize(themes.fontSizes.s)
      .backgroundColor(themes.state.backgroundColor)
      .color(themes.state.color)
      .lineHeight(themes.lineHeights.normal)
      .position("absolute")
      .margin(0)
      .top(0)
      .bottom(0)
      .left(0)
      .width(200)
      .overflowX("hidden")
      .overflowY("auto")
      .listStyle("none")
      .with(selector("& ul").color("inherit").paddingLeft(themes.space.s2).margin(0).listStyle("none"))
      .with(
        selector("& a")
          .color("inherit")
          .textDecoration("none")
          .opacity(0.8)
          .with(selector("&:hover", "&[data-current=true]").opacity(1)),
      )}>
    {map(
      groupBy(examples, (e) => e.group),
      (examples, group) => (
        <li key={group}>
          <h4 css={selector().paddingY(themes.space.s2).margin(0).color(themes.state.color)}>
            <NavLink to={`/${group}`}>{group}</NavLink>
          </h4>
          <ul>
            {map(
              groupBy(examples, (e) => e.module),
              (examples, module) => (
                <li key={module}>
                  <NavLink to={`/${group}/${module}`}>{module}</NavLink>
                  <ul>
                    {map(examples, (e) => (
                      <li key={e.name}>
                        <NavLink to={`/${group}/${module}/${e.name}`}>{e.name}</NavLink>
                      </li>
                    ))}
                  </ul>
                </li>
              ),
            )}
          </ul>
        </li>
      ),
    )}
  </ul>
));

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
        return <ExampleBlock {...ex} key={`${ex.group}:${ex.module}:${ex.name}`} />;
      })}
    </>
  );
};

export const ComponentDocs = ({ match }: IRoute<{ group?: string; module?: string; name?: string }>) => {
  return (
    <div css={cover()}>
      <Sidebar />
      <div css={selector().with(cover()).left(200).overflowX("hidden").overflowY("auto")}>
        <List filterBy={match.params} />
      </div>
    </div>
  );
};
