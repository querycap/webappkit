import { select, theme } from "@querycap-ui/core/macro";
import { parseTagRule } from "@querycap/strfmt";
import React, { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { BehaviorSubject } from "rxjs";
import { SearchInputProps } from "../search-box";
import { useKeyboardControlsOfSearchBox } from "./hooks";

export const displayTag = (v = ""): ReactNode => {
  return (
    <span
      css={select()
        .with(select("& .exp-key").opacity(0.8))
        .with(select("& .exp-op").padding("0 0.5em").color(theme.colors.primary))
        .with(select("& .exp-condition > .exp-op").color(theme.colors.primary))
        .with(
          select("& .exp-node > .exp-condition")
            .with(select("&:before").content(`"("`).paddingRight("0.2em"))
            .with(select("&:after").content(`")"`).paddingLeft("0.2em"))
            .with(select("&:before", "&:after").opacity(0.3).color(theme.colors.primary)),
        )
        .with(
          select("& .exp-value").with(
            select("&:before", "&:after").content(`"'"`).opacity(0.3).color(theme.colors.primary),
          ),
        )}>
      {parseTagRule(v)?.toJSX()}
    </span>
  );
};

export const SearchInputTag = ({ onSubmit, onCancel, defaultValue }: SearchInputProps) => {
  const inputElmRef = useRef<HTMLInputElement>(null);
  const [valid, setValid] = useState(true);

  useKeyboardControlsOfSearchBox(inputElmRef, {
    onSubmit: (v) => {
      const r = parseTagRule(v);

      if (r && r.valid()) {
        onSubmit(r.toString());
      } else {
        setValid(false);
      }
    },
    onCancel,
  });

  const inputValue$ = useMemo(() => new BehaviorSubject(defaultValue || ""), []);

  useEffect(() => {
    if (inputElmRef.current) {
      inputElmRef.current.value = inputValue$.value;
      inputElmRef.current.focus();
    }
  }, []);

  return (
    <input
      ref={inputElmRef}
      type={"text"}
      css={select().with(select().color(valid ? "inherit" : theme.colors.danger))}
    />
  );
};

SearchInputTag.display = displayTag;
