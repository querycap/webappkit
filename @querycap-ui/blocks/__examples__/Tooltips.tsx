import { TooltipTrigger } from "@querycap-ui/blocks";
import { select, roundedEm } from "@querycap-ui/core/macro";
import { Stack } from "@querycap-ui/layouts";

const TooltipDemo = ({ placement }: { placement: string }) => {
  return (
    <TooltipTrigger placement={placement as any} content={<div css={{ padding: "0.2em" }}>{placement}</div>}>
      <div
        css={{
          border: `1px solid #ddd`,
          padding: "1em",
        }}>
        {placement}
      </div>
    </TooltipTrigger>
  );
};

export const Tooltips = () => (
  <Stack spacing={roundedEm(0.6)} align={"center"} css={select("& > *").width("50%")}>
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
        <TooltipDemo placement={placement} />
      </div>
    ))}
  </Stack>
);
