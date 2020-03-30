import { useMemoizeOnce } from "@querycap/reactutils";
import { render } from "@testing-library/react";
import React, { memo, ReactNode } from "react";

describe("#useMemoizeOnce", () => {
  it("called", () => {
    const r = jest.fn();

    const Child = memo(({ render }: { render: () => ReactNode }) => {
      r();
      return <>{render()}</>;
    });

    const Parent = ({ value }: { value: number }) => {
      const createHandleClick = useMemoizeOnce((value: number) => () => 1 + value);

      return <Child render={createHandleClick(value)} />;
    };

    const node = render(<Parent value={1} />);

    expect(r).toBeCalledTimes(1);

    node.rerender(<Parent value={1} />);

    expect(r).toBeCalledTimes(1);

    node.rerender(<Parent value={2} />);

    expect(r).toBeCalledTimes(2);
  });
});
