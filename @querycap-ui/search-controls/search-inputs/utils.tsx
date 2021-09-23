import { preventDefault, select, theme } from "@querycap-ui/core/macro";
import { IconX } from "@querycap-ui/icons";

import { pipe } from "rxjs";

export function CloseBtn({ onClick }: { onClick: () => void }) {
  return (
    <a
      href="#"
      css={select().outline(0).opacity(0.5).paddingX("0.1em").position("relative").colorFill(theme.state.color)}
      onClick={pipe(preventDefault, onClick)}>
      <IconX />
    </a>
  );
}
