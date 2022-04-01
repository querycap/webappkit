import { Global } from "@emotion/react";
import { select } from "@querycap-ui/core";

import { headings } from "./headings";

export const HeadingReset = () => (
  <Global
    styles={select()
      .with(select("h1").with(headings.h1))
      .with(select("h2").with(headings.h2))
      .with(select("h3").with(headings.h3))
      .with(select("h4").with(headings.h4))
      .with(select("h5").with(headings.h5))
      .with(select("h6").with(headings.h6))}
  />
);
