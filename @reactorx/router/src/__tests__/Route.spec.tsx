import { createMemoryHistory as createHistory, createMemoryHistory } from "history";
import { Redirect, Route, Router } from "..";

import { render } from "@testing-library/react";

describe("A <Route>", () => {
  it("renders when it matches", () => {
    const text = "cupcakes";

    const node = render(
      <Router history={createMemoryHistory({ initialEntries: ["/cupcakes"] })}>
        <Route path="/cupcakes" render={() => <h1>{text}</h1>} />
      </Router>,
    );

    expect(node.container.innerHTML).toContain(text);
  });

  it("renders when it matches at the root URL", () => {
    const text = "cupcakes";

    const node = render(
      <Router history={createMemoryHistory({ initialEntries: ["/"] })}>
        <Route path="/" render={() => <h1>{text}</h1>} />
      </Router>,
    );

    expect(node.container.innerHTML).toContain(text);
  });

  it("does not render when it does not match", () => {
    const text = "bubblegum";

    const node = render(
      <Router history={createMemoryHistory({ initialEntries: ["/bunnies"] })}>
        <Route path="/flowers" render={() => <h1>{text}</h1>} />
      </Router>,
    );

    expect(node.container.innerHTML).not.toContain(text);
  });

  it("matches using nextContext when updating", () => {
    const history = createHistory({
      initialEntries: ["/sushi/california"],
    });

    const node = render(
      <Router history={history}>
        <Route path="/sushi/:roll" render={({ match }) => <h1>{match.url}</h1>} />
        <Redirect from={"/sushi/california"} to={"/sushi/spicy-tuna"} />
      </Router>,
    );

    expect(node.container.innerHTML).toContain("/sushi/spicy-tuna");
  });

  describe("with dynamic segments in the path", () => {
    it("decodes them", () => {
      const node = render(
        <Router
          history={createMemoryHistory({
            initialEntries: ["/a%20dynamic%20segment"],
          })}>
          <Route path="/:id" render={({ match }) => <h1>{match.params.id}</h1>} />
        </Router>,
      );

      expect(node.container.innerHTML).toContain("a dynamic segment");
    });
  });

  describe("with a unicode path", () => {
    it("is able to match", () => {
      const node = render(
        <Router history={createMemoryHistory({ initialEntries: ["/パス名"] })}>
          <Route path="/パス名" render={({ match }) => <h1>{match.url}</h1>} />
        </Router>,
      );

      expect(node.container.innerHTML).toContain("/パス名");
    });
  });

  describe("with `exact=true`", () => {
    it("renders when the URL does not have a trailing slash", () => {
      const text = "bubblegum";

      const node = render(
        <Router history={createMemoryHistory({ initialEntries: ["/somepath/"] })}>
          <Route exact path="/somepath" render={() => <h1>{text}</h1>} />
        </Router>,
      );

      expect(node.container.innerHTML).toContain(text);
    });

    describe("the `children` prop", () => {
      describe("that is a function", () => {
        it("receives { history, location, match } props", () => {
          const history = createHistory();

          let props: any = null;

          render(
            <Router history={history}>
              <Route path="/">
                {(p) => {
                  props = p;
                  return null;
                }}
              </Route>
            </Router>,
          );

          expect(props).not.toBe(null);
          expect(typeof props.history).toBe("object");
          expect(typeof props.location).toBe("object");
          expect(typeof props.match).toBe("object");
        });

        it("renders", () => {
          const text = "bubblegum";

          const node = render(
            <Router history={createMemoryHistory({ initialEntries: ["/"] })}>
              <Route path="/">{() => <h1>{text}</h1>}</Route>
            </Router>,
          );

          expect(node.container.innerHTML).toContain(text);
        });
      });
    });

    describe("the `component` prop", () => {
      it("renders the component", () => {
        const text = "bubblegum";

        const Home = () => <h1>{text}</h1>;

        const node = render(
          <Router history={createMemoryHistory({ initialEntries: ["/"] })}>
            <Route path="/" component={Home} />
          </Router>,
        );

        expect(node.container.innerHTML).toContain(text);
      });

      it("receives { history, location, match } props", () => {
        const history = createHistory();

        let props: any | null = null;

        const Component = (p: any) => {
          props = p;
          return null;
        };

        render(
          <Router history={history}>
            <Route path="/" component={Component} />
          </Router>,
        );

        expect(props).not.toBe(null);

        expect(typeof props.history).toBe("object");
        expect(typeof props.location).toBe("object");
        expect(typeof props.match).toBe("object");
      });
    });

    describe("the `render` prop", () => {
      it("renders its return value", () => {
        const text = "Mrs. Kato";

        const node = render(
          <Router history={createMemoryHistory({ initialEntries: ["/"] })}>
            <Route path="/" render={() => <h1>{text}</h1>} />
          </Router>,
        );

        expect(node.container.innerHTML).toContain(text);
      });

      it("receives { history, location, match } props", () => {
        const history = createHistory();

        let props: any = null;

        render(
          <Router history={history}>
            <Route
              path="/"
              render={(p) => {
                props = p;
                return null;
              }}
            />
          </Router>,
        );

        expect(props).not.toBe(null);
        expect(typeof props.history).toBe("object");
        expect(typeof props.location).toBe("object");
        expect(typeof props.match).toBe("object");
      });
    });
  });
});
