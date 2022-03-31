import { omit, size } from "@querycap/lodash";
import { AsyncStage, useEpic } from "@reactorx/core";
import { RequestActor } from "./RequestActor";
import { filter as rxFilter, ignoreElements as rxIgnoreElements, scan as rxScan, tap as rxTap } from "rxjs/operators";
import { useMemo } from "react";
import { BehaviorSubject } from "rxjs";

export const useRequesting$ = () => {
  const requesting$ = useMemo(() => new BehaviorSubject(false), []);

  useEpic((actor$) => {
    return actor$.pipe(
      rxFilter(RequestActor.isRequestActor),
      rxScan((counts, actor: any) => {
        const parentActorType = actor.opts.parentActor.type;

        const count: number = counts[parentActorType] || 0;

        if (actor.stage === AsyncStage.STARTED) {
          return {
            ...counts,
            [parentActorType]: count + 1,
          };
        }

        if (count > 1) {
          return {
            ...counts,
            [parentActorType]: count - 1,
          };
        }

        return omit(counts, parentActorType);
      }, {} as { [k: string]: number }),
      rxTap((nextRequests: any) => {
        requesting$.next(size(nextRequests) > 0);
      }),
      rxIgnoreElements(),
    );
  });

  return requesting$;
};
