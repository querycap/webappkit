import { IMsgWithType, notify } from "@querycap/notify";
import { Actor } from "@reactorx/core";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { RequestActor } from "./RequestActor";
import { IStatusError } from "./StatusError";

export const hasApiGlobalError = (data: IStatusError) => data && data.canBeTalkError && !!data.msg;

export const createApiErrorNotify = () => {
  return (action$: Observable<RequestActor>): Observable<Actor<IMsgWithType>> =>
    action$.pipe(
      filter((actor) => {
        return RequestActor.isFailedRequestActor(actor) && hasApiGlobalError(actor.arg.data);
      }),
      map((action) => {
        const { msg, desc } = action.arg.data;
        return notify.with({ type: "danger", summary: msg, description: desc });
      }),
    );
};
