import { createMemoryHistory } from "history";
import { Redirect, Switch, Route } from "../Router";
import { ReactorxRouter, routerActors } from "../ReactorxRouter";
import { act, render } from "@testing-library/react";
import { Store, StoreProvider } from "@reactorx/core";
import { omit } from "@querycap/lodash";

describe("ReactorxRouter", () => {
  it("renders the first <Redirect> that matches the URL", () => {
    const store$ = Store.create({
      _location: {
        pathname: "/three",
        search: "",
        hash: "",
        state: null,
      },
    });

    const $node = render(
      <StoreProvider value={store$}>
        <ReactorxRouter history={createMemoryHistory({})}>
          <Switch>
            <Route path="/one" render={() => <h1>one</h1>} />
            <Route path="/two" render={() => <h1>two</h1>} />
            <Redirect from="/three" to="/two" />
          </Switch>
        </ReactorxRouter>
      </StoreProvider>,
    ).container;

    expect(omit(store$.getState()._location, "key")).toEqual({
      pathname: "/two",
      search: "",
      hash: "",
      state: null,
    });

    expect($node.innerHTML).toContain("two");

    act(() => {
      routerActors.push.with("/one").invoke(store$);
    });

    expect(omit(store$.getState()._location, "key")).toEqual({
      pathname: "/one",
      search: "",
      hash: "",
      state: null,
    });
    expect($node.innerHTML).toContain("one");
  });
});
