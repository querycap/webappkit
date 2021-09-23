import { colors, roundedEm, select, theme } from "@querycap-ui/core/macro";
import { map, times } from "lodash";

export const Space = () => {
  return (
    <>
      <h2>间距</h2>

      <p>
        决定元素的 <code>margin</code>， <code>padding</code>
        通过 roundedEm，通过字号的取整差值进行转换
      </p>

      <div css={select().display("flex").flexDirection("column").alignItems("center")}>
        {map(times(10), (_, i) => {
          return (
            <div
              key={i}
              css={select()
                .paddingX(roundedEm(0.4 * i))
                .marginTop(roundedEm(0.2))
                .backgroundColor(colors.yellow1)}>
              <div
                css={select()
                  .padding(roundedEm(0.2))
                  .width(200)
                  .border("1px solid")
                  .borderColor(theme.state.borderColor)
                  .backgroundColor(theme.state.backgroundColor)}>
                roundedEm({0.4 * i})
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
