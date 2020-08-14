import { Actor, AsyncStage } from "./core";

export interface IAsyncDerived<TStartedArg = any, TDoneArg = any, TFailedArg = any> {
  startedArg: TStartedArg;
  doneArg: TDoneArg;
  failedArg: TFailedArg;
}

export class AsyncActor<TArg = any, TOpts = any, TAsyncDerived extends IAsyncDerived = IAsyncDerived> extends Actor<
  TArg,
  TOpts
> {
  static of<TArg = any, TOpts = any, TAsyncDerived extends IAsyncDerived = IAsyncDerived>(group: string) {
    return new AsyncActor<TArg, TOpts, TAsyncDerived>({ group });
  }

  named<TNamedArg = TArg, TNamedOpts = TOpts, TNamedAsyncDerived extends IAsyncDerived = TAsyncDerived>(
    name: string,
    opts?: TNamedOpts,
  ): AsyncActor<TNamedArg, TNamedOpts & TOpts, TNamedAsyncDerived> {
    return new (this.constructor as any)({
      ...(this as any),
      name,
      opts: {
        ...(this.opts as any),
        ...(opts as any),
      },
    });
  }

  get started() {
    return new Actor<TAsyncDerived["startedArg"], { parentActor: Actor<TArg, TOpts> }>({
      group: this.group,
      name: this.name,
      stage: AsyncStage.STARTED,
      opts: { parentActor: this },
    });
  }

  get cancel() {
    return new Actor<TAsyncDerived["failedArg"], { parentActor: Actor<TArg, TOpts> }>({
      group: this.group,
      name: this.name,
      stage: AsyncStage.CANCEL,
      opts: { parentActor: this },
    });
  }

  get done() {
    return new Actor<TAsyncDerived["doneArg"], { parentActor: Actor<TArg, TOpts> }>({
      group: this.group,
      name: this.name,
      stage: AsyncStage.DONE,
      opts: { parentActor: this },
    });
  }

  get failed() {
    return new Actor<TAsyncDerived["failedArg"], { parentActor: Actor<TArg, TOpts> }>({
      group: this.group,
      name: this.name,
      stage: AsyncStage.FAILED,
      opts: { parentActor: this },
    });
  }
}
