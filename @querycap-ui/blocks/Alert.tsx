import { rgba, selector, themes } from "@querycap-ui/core";
import { IconAlertCircle, IconCheckCircle, IconInfo, IconX, IconXCircle } from "@querycap-ui/icons";
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
      return themes.colors.danger;
    case "success":
      return themes.colors.success;
    case "warning":
      return themes.colors.warning;
    default:
      return themes.colors.primary;
  }
};

export const AlertCard = ({ type, onRequestClose, children }: AlertProps) => {
  const color = alertColor(type);

  return (
    <div
      css={selector()
        .position("relative")
        .display("flex")
        .width("100%")
        .paddingY("0.6em")
        .paddingX("1em")
        .borderRadius(themes.radii.s)
        .boxShadow(themes.shadows.medium)
        .backgroundColor(themes.colors.bg)
        .with(selector("& > [role=img]").fill(color).marginRight("0.8em"))
        .with(selector("& > [role=info]").flex(1))}>
      <div role={"img"}>
        <AlertIcon type={type} scale={1.2} />
      </div>
      <div role={"info"}>{children}</div>
      {onRequestClose && (
        <a
          href={"#"}
          css={{ opacity: 0.3 }}
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
      css={selector()
        .display("flex")
        .width("100%")
        .paddingY("0.6em")
        .paddingX("0.8em")
        .borderRadius(themes.radii.s)
        .borderLeft("3px solid")
        .borderColor(color)
        .backgroundColor((t) => rgba(color(t), 0.15))
        .with(selector("& > [role=img]").fill(color).marginRight("0.8em"))
        .with(selector("& > [role=info]").flex(1))}>
      <div role={"img"}>
        <AlertIcon type={type} scale={1.2} />
      </div>
      <div role={"info"}>{children}</div>
      {onRequestClose && (
        <a
          href={"#"}
          css={{ opacity: 0.3 }}
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
