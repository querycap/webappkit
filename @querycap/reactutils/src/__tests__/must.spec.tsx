import { render } from "@testing-library/react";
import React from "react";
import { must } from "..";

describe("#must", () => {
  const mustTrue = must(() => {
    return [true] as const;
  });

  const mustFalse = must(() => {
    return [false] as const;
  });

  const DemoTrue = mustTrue(({ text }: { text: string }, arg0) => {
    return arg0 ? <div>{text}</div> : null;
  });

  const DemoFalse = mustFalse(({ text }: { text: string }, arg0) => {
    return arg0 ? <div>{text}</div> : null;
  });

  it("matched render", () => {
    const node = render(<DemoTrue text={"hi"} />);

    expect(node.container.innerHTML).toContain("hi");

    node.rerender(<DemoFalse text={"hi"} />);

    expect(node.container.innerHTML).not.toContain("hi");
  });
});
