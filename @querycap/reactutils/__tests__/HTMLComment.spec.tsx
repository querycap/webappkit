import { HTMLComment } from "@querycap/reactutils";
import { render } from "@testing-library/react";
import React from "react";

const TEXT = "this is html comment";

describe("HTMLComment", () => {
  test("should render a comment in the markup", () => {
    const { container } = render(
      <span>
        <HTMLComment text={TEXT} />
      </span>,
    );

    expect(container.innerHTML).toContain(TEXT);
  });
});
