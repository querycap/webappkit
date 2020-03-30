import { select, theme } from "@querycap-ui/core/macro";
import { IconX } from "@querycap-ui/icons";
import React from "react";

export function CloseBtn({ onClick }: { onClick: () => void }) {
  return (
    <a
      href="#"
      css={select().outline(0).opacity(0.5).paddingX("0.1em").position("relative").colorFill(theme.state.color)}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}>
      <IconX />
    </a>
  );
}

export const withPreventDefault = <T extends () => any>(cb: T) => (e: React.MouseEvent) => {
  e.preventDefault();
  cb();
};
