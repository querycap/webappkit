import { InputHTMLAttributes } from "react";
import { FieldInputCommonProps } from "@querycap/form";

interface ITextAreaProps
  extends FieldInputCommonProps<string>,
    Omit<InputHTMLAttributes<HTMLTextAreaElement>, keyof FieldInputCommonProps<string>> {
  value: string;
  onValueChange: (val: string) => void;
  rows?: number;
}

export const TextArea = ({ onValueChange, rows, ...props }: ITextAreaProps) => (
  <textarea rows={rows || 3} {...props} onChange={(e) => onValueChange(e.target.value)} />
);
