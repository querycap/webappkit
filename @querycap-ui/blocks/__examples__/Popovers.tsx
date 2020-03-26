import { Popover } from "@querycap-ui/blocks";
import { select, theme } from "@querycap-ui/core/macro";
import { Stack } from "@querycap-ui/layouts";
import { useToggle, useToggleControlOnClick } from "@querycap/uikit";
import React, { useRef } from "react";

const PopoverDemo = ({ placement }: { placement: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, show, hide] = useToggle();

  useToggleControlOnClick(ref, () => (isOpen ? hide() : show()));

  return (
    <>
      <div ref={ref} css={select().border("1px solid").padding("1em").borderColor(theme.state.borderColor)}>
        {placement}
      </div>
      <Popover isOpen={isOpen} triggerRef={ref} onRequestClose={hide} placement={placement as any}>
        <div css={{ padding: "2em" }}>{placement}</div>
      </Popover>
    </>
  );
};

export const Popovers = () => (
  <Stack spacing={theme.space.s2} align={"center"} css={select("& > *").width("50%")}>
    {[
      "left",
      "right",
      "bottom",
      "top",
      "left-top",
      "left-bottom",
      "right-top",
      "right-bottom",
      "top-left",
      "bottom-left",
      "top-right",
      "bottom-right",
    ].map((placement) => (
      <div key={placement}>
        <PopoverDemo placement={placement} />
      </div>
    ))}
  </Stack>
);
