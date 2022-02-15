import { ReactNode } from "react";
import { select, theme, colors, roundedEm, tint } from "@querycap-ui/core/macro";
import { IconX } from "@querycap-ui/icons";

export const Tag = ({
  isChecked = true,
  onClick,
  children,
  large,
  closable,
  onClose,
  color,
  bordered,
  ...otherProps
}: {
  isChecked?: boolean;
  large?: boolean;
  onClick?: () => void;
  children: ReactNode;
  closable?: boolean;
  onClose?: () => void;
  color?: string;
  bordered?: boolean;
}) => {
  const bgColor = isChecked ? color || colors.blue6 : colors.gray;

  return (
    <span
      css={select()
        .display("inline-block")
        .paddingX(roundedEm(0.5))
        .paddingY(roundedEm(0.05))
        .fontSize(large ? theme.fontSizes.s : theme.fontSizes.xs)
        .color(bgColor)
        .backgroundColor(tint(0.9, bgColor))
        .border(bordered ? `1px solid ${tint(0.6, bgColor)}` : "none")
        .borderRadius(30)
        .textAlign("center")
        .cursor(onClick ? "pointer" : "default")}
      onClick={onClick}
      {...otherProps}
    >
      {children}
      {closable && (
        <IconX
          onClick={() => onClose && onClose()}
          css={select().cursor("pointer").colorFill(bgColor).marginLeft("0.5em")}
        />
      )}
    </span>
  );
};
