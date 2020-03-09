import { Store, StoreProvider } from "@reactorx/core";
import { render } from "@testing-library/react";
import { addMinutes, formatRFC3339 } from "date-fns";
import localforage from "localforage";
// @ts-ignore
import memoryStorageDriver from "localforage-memoryStorageDriver";
import React, { useEffect } from "react";
import { createPersister } from "..";

describe("Persister flow", () => {
  let persister: ReturnType<typeof createPersister>;

  let store$ = Store.create({
    $ping: 0,
    pong: 0,
    $access: "111",
  });

  beforeEach(async () => {
    await localforage.defineDriver(memoryStorageDriver);

    persister = createPersister({
      name: "test",
      driver: memoryStorageDriver._driver,
    });

    store$ = Store.create({
      $ping: 0,
      pong: 0,
      $access: "111",
    });

    function App() {
      useEffect(() => persister.connect(store$));
      return null;
    }

    render(
      <StoreProvider value={store$}>
        <App />
      </StoreProvider>,
    );

    expect((store$.getState() as any) || {}).toEqual({
      $ping: 0,
      pong: 0,
      $access: "111",
    });

    await timeout(200);
  });

  it("should store data", async () => {
    store$.next({ ...store$.getState(), $ping: 1, pong: 1 });
    store$.next({ ...store$.getState(), $ping: 2, pong: 2 });

    await timeout(200);

    const data = await persister.hydrate();

    expect(data).toEqual({
      $access: "111",
      $ping: 2,
    });
  });

  it("should deleted stored data", async () => {
    store$.next({ ...store$.getState(), $ping: undefined, pong: undefined } as any);
    await timeout(200);

    const data = await persister.hydrate();
    expect(data).toEqual({
      $access: "111",
    });
  });

  it("$access should clear all", async () => {
    store$.next({ ...store$.getState(), $ping: 1, pong: 1 } as any);
    await timeout(200);

    store$.next({ ...store$.getState(), $ping: 1, pong: 1, $access: undefined } as any);
    await timeout(1000);

    const data = await persister.hydrate();
    expect(data).toEqual({});
  });

  it("load should correctly", async () => {
    store$.next({ ...store$.getState(), $ping: 1, pong: 1 } as any);
    await timeout(200);

    const data = await persister.hydrate();

    expect(data).toEqual({
      $ping: 1,
      $access: "111",
    });
  });

  it("load should ignore expired data", async () => {
    store$.next({
      ...store$.getState(),
      $ping: {
        expireAt: formatRFC3339(addMinutes(new Date(), -5)),
      },
      pong: undefined,
    } as any);

    await timeout(200);

    const data = await persister.hydrate();
    expect(data).toEqual({
      $access: "111",
    });
  });
});

function timeout(t: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, t);
  });
}
