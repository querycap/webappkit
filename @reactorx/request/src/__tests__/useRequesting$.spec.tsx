import { createRequestActor } from "../RequestActor";
import { useRequesting$ } from "../useRequesting$";
import { Store, StoreProvider, useSelector } from "@reactorx/core";
import React from "react";
import { act, render } from "@testing-library/react";

describe("useRequesting$", () => {
  const getApiList = createRequestActor<void, { [k: string]: string }, any>("github", () => ({
    method: "GET",
    url: "/",
    headers: {
      "Content-Type": "application/json",
    },
  }));

  it("loading", () => {
    const actor = getApiList.with(undefined);

    function Loading() {
      const requesting$ = useRequesting$();
      const loading = useSelector(requesting$);
      return <span id={"loading"}>{`${loading}`}</span>;
    }

    const store$ = Store.create({});

    const node = render(
      <StoreProvider value={store$}>
        <Loading />
      </StoreProvider>,
    );

    for (let i = 0; i < 1000; i++) {
      const $loading = node.container.querySelector("#loading")!;

      act(() => {
        actor.started.invoke(store$);
      });

      expect($loading.innerHTML).toContain("true");

      if (i % 2) {
        act(() => {
          actor.done.invoke(store$);
        });
        expect($loading.innerHTML).toContain("false");
      } else {
        act(() => {
          actor.failed.invoke(store$);
        });
        expect($loading.innerHTML).toContain("false");
      }
    }
  });
});
