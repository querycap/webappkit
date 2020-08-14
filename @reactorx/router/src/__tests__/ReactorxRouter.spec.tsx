import { createMemoryHistory } from "history";
import { Switch } from "../Switch";
import { Route } from "../Route";
import { Redirect } from "../Redirect";
import React from "react";
import { ReactorxRouter, routerActors } from "../ReactorxRouter";
import { act, render } from "@testing-library/react";
import { Store, StoreProvider } from "@reactorx/core";

describe("ReactorxRouter", () => {
  it("renders the first <Redirect> that matches the URL", () => {
    const store$ = Store.create({
      _location: {
        pathname: "/three",
        search: "",
        hash: "",
        state: undefined,
      },
    });

    const $node = render(
      <StoreProvider value={store$}>
        <ReactorxRouter history={createMemoryHistory({ keyLength: 0 })}>
          <Switch>
            <Route path="/one" render={() => <h1>one</h1>} />
            <Route path="/two" render={() => <h1>two</h1>} />
            <Redirect from="/three" to="/two" />
          </Switch>
        </ReactorxRouter>
      </StoreProvider>,
    ).container;

    expect(store$.getState()).toEqual({
      _location: {
        pathname: "/two",
        search: "",
        hash: "",
        state: undefined,
      },
    });
    expect($node.innerHTML).toContain("two");

    act(() => {
      routerActors.push.with("/one").invoke(store$);
    });

    expect(store$.getState()).toEqual({
      _location: {
        pathname: "/one",
        search: "",
        hash: "",
        state: undefined,
      },
    });
    expect($node.innerHTML).toContain("one");
  });
});
