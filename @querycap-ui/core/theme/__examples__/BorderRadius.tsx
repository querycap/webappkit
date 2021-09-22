import { select, defaultTheme, theme, roundedEm } from "@querycap-ui/core/macro";
import { map } from "lodash";

export const BorderRadius = () => {
  return (
    <>
      <h2>圆角</h2>

      <div css={select().display("flex").flexDirection("column").alignItems("center").fontFamily(theme.fonts.mono)}>
        {map(defaultTheme.radii, (v, k) => {
          return (
            <div key={k} css={select().paddingX(v).marginTop(roundedEm(1.2))}>
              <div
                css={select()
                  .padding(roundedEm(0.6))
                  .width(400)
                  .border("1px solid")
                  .borderRadius(v)
                  .borderColor(theme.state.borderColor)
                  .backgroundColor(theme.state.backgroundColor)}>
                radii.{k} = {v}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
