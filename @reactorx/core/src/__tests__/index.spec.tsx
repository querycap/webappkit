import { filter, map } from "rxjs/operators";
import { Actor, AsyncActor, renderOn, Store, StoreProvider, useConn, useEpic, useSelector, useStore, Volume } from "..";
import React from "react";
import { Observable } from "rxjs";
import { act, render } from "@testing-library/react";

describe("@reactorx/core", () => {
  test("AsyncActor", () => {
    const requestActor = AsyncActor.of<any, any>("request");
    const ping = requestActor.named("ping");

    expect(ping.type).toBe("@@request/ping");
    expect(ping.done.type).toBe("@@request/ping::DONE");
    expect(ping.failed.type).toBe("@@request/ping::FAILED");
    expect(ping.started.type).toBe("@@request/ping::STARTED");
  });

  test("Store", () => {
    const testActor = Actor.of("test");

    const ping = testActor.named<{ step?: number }, { o: string }>("ping").effectOn("ping", (state = 0, actor) => {
      return Number(state) + (actor.arg.step || 1);
    });

    const pong = testActor.named("pong").effectOn("pong", (state = 0) => {
      return Number(state) + 1;
    });

    const so$ = Store.create({ ping: 0, pong: 0 });

    so$.applyMiddleware(() => (next) => (actor) => next(actor));

    const pingStates: number[] = [];
    const pongStates: number[] = [];

    Volume.from(so$, (state) => state["ping"]).subscribe((nextState) => {
      pingStates.push(nextState);
    });

    Volume.from(so$, (state) => state["pong"]).subscribe((nextState) => {
      pongStates.push(nextState);
    });

    renderOn(so$, () => {
      return null;
    });

    so$.epicOn((actor$) => {
      return actor$.pipe(
        filter(ping.is),
        map(() => {
          return pong.with({});
        }),
      );
    });

    for (let i = 0; i < 5; i++) {
      ping.with({}).invoke(so$);

      expect(so$.getState()).toEqual({
        ping: 1 + i,
        pong: 1 + i,
      });
    }

    expect(pingStates).toEqual([0, 1, 2, 3, 4, 5]);
    expect(pongStates).toEqual([0, 1, 2, 3, 4, 5]);
  });

  test("in react", () => {
    const testActor = Actor.of("test");

    const ping = testActor.named<{ step?: number }, { o: string }>("ping").effectOn("ping", (state: any = 0, actor) => {
      return Number(state) + (actor.arg.step || 1);
    });

    const pong = testActor.named("pong").effectOn("pong", (state: any = 0) => {
      return Number(state) + 1;
    });

    const pingToPong = (actor$: Observable<Actor>) => {
      return actor$.pipe(
        filter(ping.is),
        map(() => {
          return pong.with({});
        }),
      );
    };

    const so$ = Store.create({ ping: 0, pong: 0 });

    const Ping = () => {
      useEpic(pingToPong);

      const ping$ = useConn(so$, (state) => state["ping"]);

      return (
        <>
          {renderOn(ping$, (ping) => (
            <span id={"ping"}>{ping}</span>
          ))}
        </>
      );
    };

    function PongOrPing({ name }: { name: string }) {
      const store$ = useStore();
      const pingOrPong = useSelector(store$, (state) => state[name as any], [name]);

      return (
        <span id={"pingOrPong"}>
          {name} {pingOrPong}
        </span>
      );
    }

    const App = (props: { ping: boolean }) => {
      const pong$ = useConn(so$, (state) => state["pong"]);

      return (
        <StoreProvider value={so$}>
          {props.ping && <Ping />}
          {renderOn(pong$, (pong) => (
            <span id={"pong"}>{pong}</span>
          ))}
          <PongOrPing name={props.ping ? "ping" : "pong"} />
        </StoreProvider>
      );
    };

    const node = render(<App ping={true} />);

    for (let i = 0; i < 10; i++) {
      act(() => {
        ping.with({}).invoke(so$);
      });

      const $ping = node.container.querySelector("#ping")!;
      const $pong = node.container.querySelector("#pong")!;
      const $pingOrPong = node.container.querySelector("#pingOrPong")!;

      expect($ping.innerHTML).toContain(so$.getValue()["ping"]);
      expect($pong.innerHTML).toContain(so$.getValue()["pong"]);

      expect($pingOrPong.innerHTML).toContain("ping");
      expect($pingOrPong.innerHTML).toContain(so$.getValue()["ping"]);
    }

    node.rerender(<App ping={false} />);

    for (let i = 0; i < 10; i++) {
      act(() => {
        ping.with({}).invoke(so$);
      });

      const $ping = node.container.querySelector("#ping");
      const $pong = node.container.querySelector("#pong")!;
      const $pingOrPong = node.container.querySelector("#pingOrPong")!;

      expect($ping).toBeNull();
      expect($pong.innerHTML).toContain(so$.getValue()["pong"]);

      expect($pingOrPong.innerHTML).toContain("pong");
      expect($pingOrPong.innerHTML).toContain(so$.getValue()["pong"]);
    }
  });
});
