import { roundedEm, select, shadows, theme } from "@querycap-ui/core";
import { map } from "@querycap/lodash";

export const Shadows = () => {
  return (
    <>
      <h2>阴影</h2>

      <div css={select().display("flex").flexDirection("column").alignItems("center").fontFamily(theme.fonts.mono)}>
        {map(shadows, (v, k) => {
          return (
            <div key={k} css={select().paddingX(v).marginTop(roundedEm(1.2))}>
              <div
                css={select()
                  .padding(roundedEm(0.6))
                  .width(400)
                  .borderRadius(theme.radii.normal)
                  .backgroundColor(theme.state.backgroundColor)
                  .boxShadow(v)}
              >
                {k}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};
