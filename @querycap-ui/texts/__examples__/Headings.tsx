import { headings } from "@querycap-ui/texts";
import React from "react";

export const Headings = () => {
  return (
    <div>
      <h1 css={headings.h1}>Heading1</h1>
      <h2 css={headings.h2}>Heading2</h2>
      <h3 css={headings.h3}>Heading3</h3>
      <h4 css={headings.h4}>Heading4</h4>
      <h5 css={headings.h5}>Heading5</h5>
      <h6 css={headings.h6}>Heading6</h6>
    </div>
  );
};
