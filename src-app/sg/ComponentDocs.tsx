import { applyStyles, cover, selector, themes, WithBackground } from "@querycap-ui/core";
import { IRoute, NavLink } from "@reactorx/router";
import { filter, groupBy, map } from "lodash";
import React, { ReactNode } from "react";
import { CodeBlock } from "./CodeBlock";

import { examples, IExample } from "./exmaple";

const ExampleSection = ({ children }: { children?: ReactNode }) => (
  <div
    css={applyStyles(
      selector()
        .position("relative")
        .padding(themes.space.s4),
      selector("& + &").marginTop(themes.space.s4),
    )}>
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
        .borderBottom("1px solid")
        .borderColor(themes.colors.border)}>
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
      <div
        css={selector()
          .border(`1px solid`)
          .borderColor(themes.colors.border)}>
        {map(examples, (Example, key) => (
          <ExampleSection key={key}>
            <Example />
          </ExampleSection>
        ))}
      </div>
      {!!source && <CodeBlock>{source}</CodeBlock>}
    </div>
  );
};

function Sidebar() {
  return (
    <ul
      css={applyStyles(
        selector()
          .position("absolute")
          .margin(0)
          .padding(themes.space.s3)
          .fontSize(themes.fontSizes.s)
          .backgroundColor(themes.colors.bg)
          .color(themes.colors.text)
          .top(0)
          .bottom(0)
          .lineHeight(themes.lineHeights.normal)
          .left(0)
          .width(200)
          .overflowX("hidden")
          .overflowY("auto")
          .listStyle("none"),
        selector("& ul")
          .color("inherit")
          .paddingLeft(themes.space.s2)
          .margin(0)
          .listStyle("none"),
        selector("& a")
          .color("inherit")
          .textDecoration("none")
          .opacity(0.8),
        selector("& a:hover").opacity(1),
        selector("& a[data-current=true]").opacity(1),
      )}>
      {map(
        groupBy(examples, (e) => e.group),
        (examples, group) => (
          <li key={group}>
            <h4
              css={selector()
                .paddingY(themes.space.s2)
                .margin(0)
                .color(themes.colors.text)}>
              <NavLink to={`/${group}`}>{group}</NavLink>
            </h4>
            <ul>
              {map(
                groupBy(examples, (e) => e.module),
                (_, module) => (
                  <li key={module}>
                    <NavLink to={`/${group}/${module}`}>{module}</NavLink>
                  </li>
                ),
              )}
            </ul>
          </li>
        ),
      )}
    </ul>
  );
}

const List = ({ filterBy }: { filterBy: { group?: string; module?: string } }) => {
  const matched =
    filterBy.group || filterBy.module
      ? filter(examples, (e) => {
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

export const ComponentDocs = ({ match }: IRoute<{ group?: string; module?: string }>) => {
  return (
    <div css={cover()}>
      <WithBackground color={(t) => t.colors.gray9}>
        <Sidebar />
      </WithBackground>
      <div
        css={selector()
          .with(cover())
          .left(200)
          .overflowX("hidden")
          .overflowY("auto")}>
        <List filterBy={match.params} />
      </div>
    </div>
  );
};
