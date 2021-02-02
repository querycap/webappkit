import { select } from "@querycap-ui/core/macro";
import { keyframes } from "@emotion/react";

const skeletonLoading = keyframes({
  "0%": {
    backgroundPosition: "100% 50%",
  },
  "100%": {
    backgroundPosition: "0% 50%",
  },
});

const commonStyle = select()
  .background("linear-gradient(90deg,hsla(0,0%,74.5%,.2) 25%,hsla(0,0%,50.6%,.24) 37%,hsla(0,0%,74.5%,.2) 63%)")
  .backgroundSize("400% 100%")
  .animation(`${skeletonLoading} 1.4s ease infinite`);

export const Skeleton = () => {
  return (
    <div css={select().width("100%")}>
      <h3 css={select().width("40%").height(16).marginTop(16).borderRadius(4).with(commonStyle)} />
      <ul
        css={select()
          .margin(0)
          .padding(0)
          .listStyle("none")
          .marginTop(24)
          .with(
            select("> li")
              .width("100%")
              .height(16)
              .listStyle("none")
              .borderRadius(4)
              .marginBottom(16)
              .with(commonStyle),
          )}>
        <li />
        <li />
        <li css={select().width("60%")} />
      </ul>
    </div>
  );
};
