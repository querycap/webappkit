import { Store } from "@reactorx/core";
import { isBefore, parseISO } from "date-fns";
import { createInstance, LOCALSTORAGE } from "localforage";
import { filter, isNull, isUndefined, keys, map, uniq } from "lodash";
import { fromEvent, merge } from "rxjs";
import { tap } from "rxjs/operators";

// $access need persist
// $$access need persist and crossTabs
const isPersist = (key = "") => {
  return [key.startsWith("$"), key[1] === "$"] as const;
};

export const createPersister = (opts: LocalForageOptions) => {
  return new Persister({
    driver: LOCALSTORAGE,
    ...opts,
    name: opts.name || "app",
  });
};

export class Persister {
  storage: LocalForage;

  constructor(opts: LocalForageOptions) {
    this.storage = createInstance(opts);
  }

  clear() {
    console.log("all clear");
    return this.storage.clear();
  }

  hydrate(callback?: (data: { [k: string]: any }) => void) {
    return this.load("$persist")
      .then((keys: string[]) => {
        return Promise.all(
          map(keys, (key) => {
            return this.load(key).then((values) => ({
              key,
              values,
            }));
          }),
        );
      })
      .then((values) => {
        const data: { [k: string]: any } = {};

        values.forEach((v: any) => {
          if (!isUndefined(v.values) && !isNull(v.values)) {
            data[v.key] = v.values;
          }
        });

        console.log("hydrated", data);

        if (callback) {
          callback(data);
        }

        return data;
      })
      .catch((e) => console.error(e));
  }

  connect(store$: Store<any>) {
    let prevState: any = {};

    const subscription = merge(
      store$.pipe(
        tap((nextState = {}) => {
          const keysToDelete: string[] = [];
          const persists: string[] = [];
          let clearAll = false;

          const nextDataToStore: { [key: string]: any } = {};

          const allPersists = uniq(filter([...keys(prevState), ...keys(nextState)], (key) => isPersist(key)[0]));

          for (const key of allPersists) {
            if (!!prevState[key] && isUndefined(nextState[key])) {
              keysToDelete.push(key);

              if (key.includes("access")) {
                clearAll = true;
              }

              continue;
            }

            persists.push(key);

            if (nextState[key] !== prevState[key]) {
              nextDataToStore[key] = nextState[key];
            }
          }

          prevState = nextState;

          if (clearAll) {
            this.clear();
          } else {
            nextDataToStore["$persist"] = persists;

            this.saveAll(nextDataToStore);
            this.removeAll(keysToDelete);
          }
        }),
      ),

      fromEvent(globalThis, "storage").pipe(
        tap((e: any) => {
          if (!e.isTrusted || !e.key || !e.newValue) {
            return;
          }

          const prefix = this.storage.config().name!;

          if (!e.key.startsWith(prefix)) {
            return;
          }

          const finalKey = e.key.replace(prefix + "/", "");

          if (finalKey[1] !== "$") {
            return;
          }

          try {
            const values = JSON.parse(e.newValue);

            store$.next({
              ...store$.value,
              [finalKey]: values,
            });

            console.warn(finalKey, "updated from storage");
          } catch (e) {
            // -
          }
        }),
      ),
    ).subscribe();

    return () => {
      prevState = undefined;
      subscription.unsubscribe();
    };
  }

  removeAll(keys: string[]) {
    if (keys.length === 0) {
      return Promise.resolve();
    }

    return Promise.all(
      keys.map((key) => {
        return this.remove(key);
      }),
    ).catch((e) => console.error(e));
  }

  saveAll(nextData: { [key: string]: any } = {}) {
    const ks = keys(nextData);

    if (ks.length === 0) {
      return Promise.resolve();
    }

    return Promise.all(ks.map((key) => this.save(key, nextData[key]))).catch((e) => console.error(e));
  }

  load<T = any>(key: string) {
    return this.storage
      .getItem<T>(key)
      .then((values) => {
        if (isValidValue(values)) {
          return values;
        }
        return undefined;
      })
      .catch();
  }

  save(key: string, values: any) {
    return this.storage.setItem(key, values);
  }

  remove(key: string) {
    return this.storage.removeItem(key);
  }
}

const isExpired = (expireAt = "") => isBefore(parseISO(expireAt), new Date());

function isValidValue(value: any) {
  if (isUndefined(value)) {
    return false;
  }
  if (isNull(value)) {
    return false;
  }
  if (value.expireAt) {
    return !isExpired(value.expireAt);
  }
  return true;
}
