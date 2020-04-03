import { Msg, notify } from "@querycap/notify";
import { Actor } from "@reactorx/core";
import { Observable } from "rxjs";
import { filter, map } from "rxjs/operators";
import { RequestActor } from "./RequestActor";
import { IStatusError } from "./StatusError";

export const hasApiGlobalError = (data: IStatusError) => data && data.canBeTalkError && !!data.msg;

export const createApiErrorNotify = () => {
  return (action$: Observable<RequestActor>): Observable<Actor<Omit<Msg, "id">>> =>
    action$.pipe(
      filter((actor) => {
        return RequestActor.isFailedRequestActor(actor) && hasApiGlobalError(actor.arg.data);
      }),
      map((action) => {
        const { msg, desc } = action.arg.data;
        return notify.with({ type: "error", summary: msg, description: desc });
      }),
    );
};
