import { InputHTMLAttributes, useEffect, useRef } from "react";
import { SearchInputProps } from "../search-box";
import { useKeyboardControlsOfSearchBox } from "./hooks";

export const SearchInputText = ({
  onSubmit,
  onCancel,
  defaultValue,
  usedValues,
  ...otherProps
}: SearchInputProps & Omit<InputHTMLAttributes<HTMLInputElement>, "onSubmit" | "onCancel">) => {
  const inputElmRef = useRef<HTMLInputElement>(null);

  useKeyboardControlsOfSearchBox(inputElmRef, { onSubmit, onCancel });

  useEffect(() => {
    if (inputElmRef.current) {
      inputElmRef.current.value = defaultValue || "";
      inputElmRef.current.focus();
    }
  }, []);

  return <input role={"input"} ref={inputElmRef} type={"text"} {...otherProps} />;
};
