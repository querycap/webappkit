import { select, shadows, theme, transparentize } from "@querycap-ui/core/macro";
import { IconAlertCircle, IconCheckCircle, IconInfo, IconX, IconXCircle } from "@querycap-ui/icons";
import { flow } from "lodash";
import React, { ReactNode } from "react";

export interface AlertProps {
  type: "info" | "success" | "error" | "warning";
  children?: ReactNode;
  onRequestClose?: () => void;
}

const AlertIcon = ({ type, scale }: { type: AlertProps["type"]; scale?: number }) => {
  switch (type) {
    case "error":
      return <IconXCircle scale={scale} />;
    case "success":
      return <IconCheckCircle scale={scale} />;
    case "warning":
      return <IconAlertCircle scale={scale} />;
    default:
      return <IconInfo scale={scale} />;
  }
};

const alertColor = (type: AlertProps["type"]) => {
  switch (type) {
    case "error":
      return theme.colors.danger;
    case "success":
      return theme.colors.success;
    case "warning":
      return theme.colors.warning;
    default:
      return theme.colors.primary;
  }
};

export const AlertCard = ({ type, onRequestClose, children }: AlertProps) => {
  const color = alertColor(type);

  return (
    <div
      css={select()
        .position("relative")
        .display("flex")
        .width("100%")
        .paddingY("0.6em")
        .paddingX("1em")
        .borderRadius(theme.radii.s)
        .boxShadow(shadows.medium)
        .color(theme.state.color)
        .backgroundColor(theme.state.backgroundColor)
        .with(select("& > [role=img]").fill(color).marginRight("0.8em"))
        .with(select("& > [role=info]").flex(1))}>
      <div role={"img"}>
        <AlertIcon type={type} scale={1.2} />
      </div>
      <div role={"info"}>{children}</div>
      {onRequestClose && (
        <a
          href={"#"}
          css={select().opacity(0.3).colorFill(theme.state.color)}
          role={"button"}
          onClick={(e) => {
            e.preventDefault();
            onRequestClose();
          }}>
          <IconX />
        </a>
      )}
    </div>
  );
};

export const Alert = ({ type, onRequestClose, children }: AlertProps) => {
  const color = alertColor(type);

  return (
    <div
      css={select()
        .display("flex")
        .width("100%")
        .paddingY("0.6em")
        .paddingX("0.8em")
        .borderRadius(theme.radii.s)
        .borderLeft("3px solid")
        .borderColor(color)
        .backgroundColor(flow(color, transparentize(0.85)))
        .with(select("& > [role=img]").fill(color).marginRight("0.8em"))
        .with(select("& > [role=info]").flex(1))}>
      <div role={"img"}>
        <AlertIcon type={type} scale={1.2} />
      </div>
      <div role={"info"}>{children}</div>
      {onRequestClose && (
        <a
          href={"#"}
          css={select().opacity(0.3).colorFill(theme.state.color)}
          role={"button"}
          onClick={(e) => {
            e.preventDefault();
            onRequestClose();
          }}>
          <IconX />
        </a>
      )}
    </div>
  );
};
