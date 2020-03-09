export const createWorker = <TArg extends any, TOutput extends any>(exec: (arg: TArg) => TOutput) => {
  self &&
    self.addEventListener &&
    self?.addEventListener("message", (event) => {
      self.postMessage(exec(event.data));
    });
  return exec;
};

export const fromWorker = <TArg, TOutput>(
  importWorker: () => Promise<{
    default: (arg: TArg) => TOutput;
  }>,
) => {
  return (arg: TArg): Promise<TOutput> => {
    return importWorker().then((mod: { default: (arg: TArg) => TOutput }) => {
      const Worker = (mod as any).default as { prototype: Worker; new (): Worker };

      if (!Worker.prototype) {
        return Promise.resolve((Worker as any)(arg));
      }

      return new Promise<TOutput>((resolve, reject) => {
        const worker = new (Worker as { prototype: Worker; new (): Worker })();

        worker.onerror = (e) => reject(e);
        worker.onmessage = (event) => {
          resolve(event.data);
        };

        worker.postMessage(arg);
      });
    });
  };
};
