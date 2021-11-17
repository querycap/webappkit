import { ReactNode, InputHTMLAttributes } from "react";
import { colors, select, theme } from "@querycap-ui/core";
import { Button } from "./Button";

export interface IRadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Radio = ({ label, disabled, checked, onCheckedChange, ...inputProps }: IRadioProps) => {
  return (
    <label
      css={select()
        .display("flex")
        .alignItems("center")
        .justifyContent("flex-start")
        .padding("0.2em 0")
        .opacity(disabled ? 0.7 : 1)
        .color(colors.gray5)
        .with(
          select("&:hover")
            .cursor(disabled ? "not-allowed" : "pointer")
            .opacity(disabled ? 0.7 : 0.8),
        )}
    >
      <input
        css={{ display: "none" }}
        type="radio"
        {...inputProps}
        disabled={disabled}
        checked={checked}
        onChange={(e) => {
          if (e.target.checked !== checked) {
            return onCheckedChange && onCheckedChange(!checked);
          }
        }}
      />
      <span
        css={select()
          .borderColor(theme.colors.primary)
          .position("relative")
          .top(0)
          .left(0)
          .display("block")
          .width(16)
          .height(16)
          .backgroundColor(colors.white)
          .borderStyle("solid")
          .borderColor(checked ? theme.colors.primary : colors.gray5)
          .borderWidth(checked ? 5 : 1)
          .borderRadius("100%")
          // .transition("border-width .1s")
          .transition("all .3s cubic-bezier(.78,.14,.15,.86)")
          .marginRight("0.5em")}
      />
      {label && <span>{label}</span>}
    </label>
  );
};

export const ButtonRadio = ({ label, disabled, checked, onCheckedChange, children: _, ...otherProps }: IRadioProps) => (
  <Button
    {...(otherProps as any)}
    disabled={disabled}
    primary={!!checked}
    onClick={() => onCheckedChange && onCheckedChange(!checked)}
    small
  >
    {label && <span>{label}</span>}
  </Button>
);
