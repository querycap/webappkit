import { select, theme, roundedEm } from "@querycap-ui/core/macro";
import { map } from "lodash";

import * as IconSets from "..";

export const NOSRC = true;

export const Icons = () => (
  <div css={select().display("flex").flexWrap("wrap")}>
    {map(IconSets, (Icon, key) => (
      <div key={key} css={select().display("flex").alignItems("center").width("25%").colorFill(theme.state.color)}>
        <span css={select().fontSize(theme.fontSizes.l).padding(roundedEm(0.3))}>
          <Icon />
        </span>
        <span css={select().fontSize(theme.fontSizes.s).fontFamily(theme.fonts.mono).padding(roundedEm(0.3))}>
          {key}
        </span>
      </div>
    ))}
  </div>
);
