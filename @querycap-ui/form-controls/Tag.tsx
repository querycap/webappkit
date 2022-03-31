import { ReactNode } from "react";
import { select, theme, colors, roundedEm, tint } from "@querycap-ui/core";
import { IconX } from "@querycap-ui/icons";

export const Tag = ({
  isChecked = true,
  onClick,
  children,
  large,
  closable,
  onClose,
  color,
  ...otherPorps
}: {
  isChecked?: boolean;
  large?: boolean;
  onClick?: () => void;
  children: ReactNode;
  closable?: boolean;
  onClose?: () => void;
  color?: string;
}) => {
  const bgColor = isChecked ? color || colors.blue6 : colors.gray;

  return (
    <span
      css={select()
        .display("inline-block")
        .paddingX(roundedEm(0.5))
        .paddingY(roundedEm(0.1))
        .fontSize(large ? theme.fontSizes.s : theme.fontSizes.xs)
        .color(bgColor)
        .backgroundColor(tint(0.9, bgColor))
        .border(`1px solid ${tint(0.6, bgColor)}`)
        .borderRadius(theme.radii.s)
        .textAlign("center")
        .cursor(onClick ? "pointer" : "default")}
      onClick={onClick}
      {...otherPorps}
    >
      {children}
      {closable && <IconX onClick={() => onClose && onClose()} css={select().colorFill(bgColor).marginLeft("0.5em")} />}
    </span>
  );
};
