import { Stack } from "@querycap-ui/layouts";
import { select, roundedEm } from "@querycap-ui/core";
import { keyframes } from "@emotion/react";
import { range, map } from "lodash";
import { theme } from "@querycap-ui/core/macro";

const rotate = keyframes({
  to: {
    transform: "rotate(405deg)",
  },
});

const move = keyframes({
  to: {
    opacity: 1,
  },
});

export const Loading = ({ ...props }) => {
  return (
    <Stack css={select().minHeight(roundedEm(3)).height("100%")} inline justify="center" align={"center"}>
      <span
        css={{
          position: "relative",
          display: "inline-block",
          margin: "0 auto",
          fontSize: "1.2em",
          width: "1.2em",
          height: "1.2em",
          transform: "rotate(45deg)",
          animation: `${rotate} 1.2s infinite linear`,
        }}
        {...props}>
        {map(range(4), (i) => {
          return (
            <i
              key={i}
              css={select()
                .backgroundColor(theme.colors.primary)
                .position("absolute")
                .width("0.5em")
                .height("0.5em")
                .opacity(0.3)
                .transform("scale(0.75)")
                .borderRadius("100%")
                .animation(`${move} 1s infinite linear alternate`)
                .with(i === 0 && select().top(0).left(0))
                .with(i === 1 && select().top(0).right(0).animationDelay("0.4s"))
                .with(i === 2 && select().bottom(0).right(0).animationDelay("0.8s"))
                .with(i === 3 && select().bottom(0).left(0).animationDelay("1.2s"))}
            />
          );
        })}
      </span>
    </Stack>
  );
};
