import { createMemoryHistory as createHistory } from "history";
import { Prompt, PromptUserConfirmation, Router } from "..";
import { act, render } from "@testing-library/react";
import { jest } from "@jest/globals";

describe("A <Prompt>", () => {
  it("calls getUserConfirmation with the prompt message", () => {
    const getUserConfirmation = jest.fn((_, callback: any) => {
      callback(false);
    });

    const history = createHistory({});

    render(
      <PromptUserConfirmation getUserConfirmation={getUserConfirmation}>
        <Router history={history}>
          <Prompt message="Are you sure?" />
        </Router>
        ,
      </PromptUserConfirmation>,
    );

    act(() => {
      history.push("/somewhere");
    });

    expect(getUserConfirmation).toHaveBeenCalledWith(expect.stringMatching("Are you sure?"), expect.any(Function));
  });

  describe("with when=false", () => {
    it("does not call getUserConfirmation", () => {
      const getUserConfirmation = jest.fn((_, callback: any) => {
        callback(false);
      });

      const history = createHistory({});

      render(
        <PromptUserConfirmation getUserConfirmation={getUserConfirmation}>
          <Router history={history}>
            <Prompt message="Are you sure?" when={false} />
          </Router>
          ,
        </PromptUserConfirmation>,
      );

      act(() => {
        history.push("/somewhere");
      });

      expect(getUserConfirmation).not.toHaveBeenCalled();
    });
  });
});
