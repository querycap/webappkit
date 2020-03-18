import { applyStyles, cover, selector, themes, WithBackground } from "@querycap-ui/core";
import { IRoute, NavLink } from "@reactorx/router";
import { filter, groupBy, isFunction, last, map } from "lodash";
import React, { Fragment, ReactNode } from "react";

const groups = {
  "@querycap": (require as any).context("@querycap/", true, /\/__examples__\/(.+)\.tsx?$/),
  "@querycap-ui": (require as any).context("@querycap-ui/", true, /\/__examples__\/(.+)\.tsx?$/),
};

const getComponents = (req: any) => filter(req.keys(), () => true) as string[];

const getComponentName = (key: string) => {
  const result = key.replace(/\.tsx?$/g, "").split("/");
  return `${last(result)}`;
};

const getModuleName = (key: string) => {
  const result = key.replace(/\.tsx?$/g, "").split("/");
  return `${result[1]}`;
};

interface ISectionProps {
  title?: ReactNode;
  children?: ReactNode;
}

const Section = ({ title, children }: ISectionProps) => (
  <div
    css={selector()
      .position("relative")
      .padding(themes.space.s4)
      .borderBottom("1px solid")
      .borderColor(themes.colors.border)}>
    <div
      css={selector()
        .paddingY(themes.space.s2)
        .opacity(0.4)}>
      {title}
    </div>
    <div>{children}</div>
  </div>
);

const SubSection = ({ title, children }: ISectionProps) => (
  <div
    css={applyStyles(
      selector()
        .position("relative")
        .padding(themes.space.s4)
        .border("1px solid")
        .borderColor(themes.colors.border),

      selector("& + &").marginTop(themes.space.s4),
    )}>
    <h5
      css={selector()
        .margin(0)
        .paddingBottom(themes.space.s3)}>
      {title}
    </h5>
    <div>{children}</div>
  </div>
);

interface IExampleListProps {
  name: string;
  module: string;
  group: string;
  examples: { [k: string]: () => JSX.Element };
}

const ExampleList = ({ name, module, group, examples }: IExampleListProps) => (
  <Section title={`${group}/${module}/${name}`}>
    {map(examples, (Example, key) => {
      if (!isFunction(Example)) {
        throw Example;
      }
      return (
        <SubSection key={key} title={key}>
          <Example />
        </SubSection>
      );
    })}
  </Section>
);

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
      {map(groups, (req, group) => (
        <li key={group}>
          <h4
            css={selector()
              .paddingY(themes.space.s2)
              .margin(0)
              .color(themes.colors.text)}>
            <NavLink to={`/${group}`}>{group}</NavLink>
          </h4>
          <ul>
            {map(groupBy(getComponents(req), getModuleName), (keys, module) => {
              return (
                <li key={module}>
                  <NavLink to={`/${group}/${module}`}>{module}</NavLink>
                  <ul>
                    {map(keys, (key, i) => {
                      const name = getComponentName(key);

                      return (
                        <li key={i}>
                          <NavLink to={`/${group}/${module}/${name}`}>{name}</NavLink>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </li>
      ))}
    </ul>
  );
}

export const ComponentDocs = ({ match }: IRoute<{ group?: string; module?: string; name?: string }>) => {
  return (
    <div css={cover()}>
      <WithBackground color={(t) => t.colors.black}>
        <Sidebar />
      </WithBackground>
      <div
        css={applyStyles(
          cover(),
          selector()
            .left(200)
            .overflowX("hidden")
            .overflowY("auto"),
        )}>
        {map(groups, (req, group) => {
          if (match.params.group && match.params.group !== group) {
            return null;
          }

          const componentList = getComponents(req);

          const matchedComponentList =
            match.params.group === group && match.params.module
              ? filter(componentList, (key) => {
                  const isMatchedModule = getModuleName(key) === match.params.module;

                  if (match.params.name) {
                    return isMatchedModule && getComponentName(key) === match.params.name;
                  }

                  return isMatchedModule;
                })
              : componentList;

          return (
            <Fragment key={group}>
              {map(matchedComponentList, (key, idx) => (
                <ExampleList
                  key={`${group}::${idx}`}
                  name={getComponentName(key)}
                  module={getModuleName(key)}
                  group={group}
                  examples={req(key) as { [k: string]: () => JSX.Element }}
                />
              ))}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};
