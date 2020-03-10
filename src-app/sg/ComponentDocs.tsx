import { cover, padding, rgba, useDesignSystem } from "@querycap-ui/core";
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
  <div css={{ ...padding("1em", 0), borderBottom: "1px solid #f0f0f0" }}>
    <h4 css={{ margin: 0, ...padding(0, "1em") }}>{title}</h4>
    <div css={{ ...padding("1em") }}>{children}</div>
  </div>
);

const SubSection = ({ title, children }: ISectionProps) => (
  <div
    css={{
      ...padding("3em", "1em", "1em"),
      position: "relative",
      border: "1px solid #f0f0f0",
      borderRadius: 4,
      "& + &": {
        marginTop: "1em",
      },
    }}>
    <h5
      css={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        ...padding("0.8em", "1em"),
        margin: 0,
      }}>
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
  const ds = useDesignSystem();

  return (
    <ul
      css={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        width: 200,
        overflowX: "hidden",
        overflowY: "auto",
        fontSize: ds.size.xs,
        backgroundColor: `${ds.color.primary}`,
        "& ul": {
          padding: 0,
          listStyle: "none",
          paddingLeft: "1em",
        },
        "& a": {
          display: "block",
          color: `${ds.color.text}`,
          padding: "0.3em 0.6em",
          "&:hover": {
            backgroundColor: rgba(ds.color.text, 0.5),
          },
        },
      }}>
      <li>
        <NavLink to="/" exact>
          ALL
        </NavLink>
      </li>
      {map(groups, (req, group) => (
        <li key={group}>
          <h4 css={{ color: `${ds.color.text}` }}>
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
      <Sidebar />
      <div
        css={{
          ...cover(),
          left: 200,
          overflowX: "hidden",
          overflowY: "auto",
        }}>
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
