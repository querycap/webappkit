import { Plugin, ResolvedConfig } from "vite";
import { EmittedFile, NormalizedOutputOptions, PluginContext, RenderedChunk, TransformResult } from "rollup";

export const importMetaFileURL = (ref: string) => {
  return `import.meta.ROLLUP_FILE_URL_${ref}`;
};

export interface PluginProxy extends Plugin {
  // a hook both support serve and build
  transformChunk?(
    this: PluginContext,
    code: string,
    id: string,
    ssr?: boolean,
  ): Promise<TransformResult> | TransformResult;
}

const pickCode = <TResult extends TransformResult | string | undefined | null>(ret: TResult): string | null => {
  if (ret) {
    if (typeof ret === "object") {
      if (ret.code) {
        return ret.code;
      }
      return null;
    } else {
      return ret;
    }
  }
  return null;
};

export const paramsOf = (id: string) => new URLSearchParams(id.split("?")[1] || "");

// with this wrap could be support emitFile for vite
export const wrap = ({ transformChunk, ...plugin }: PluginProxy): Plugin => {
  let config: ResolvedConfig;

  let refIdx = 0;
  const refs = new Map();

  const withProxyContext = (ctx: PluginContext) => ({
    ...ctx,
    emitFile: (e: EmittedFile) => {
      if (config && config.command == "serve") {
        const refID = `ref${refIdx++}`;
        refs.set(refID, e);
        return refID;
      }
      return ctx.emitFile(e);
    },
  });

  async function transform(this: PluginContext, code: string, id: string, ssr: boolean) {
    if (plugin.transform) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const ret = pickCode(await plugin.transform.call(this as any, code, id, { ssr }));
      if (ret) {
        code = ret;
      }
    }

    if (config && config.command == "serve") {
      // vite serve only
      // TODO should use ast
      const matched = [...code.matchAll(/import\.meta\.([A-Za-z0_]+)/g)].map((r) => r[0]);

      matched.forEach((m) => {
        const prop = m.slice("import.meta.".length);

        if (prop.startsWith("ROLLUP_FILE_URL_")) {
          const emitted = refs.get(prop.slice("ROLLUP_FILE_URL_".length));

          let replaceTo = JSON.stringify(emitted.fileName || emitted.id);

          if (plugin.resolveFileUrl) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            const fileURL = plugin.resolveFileUrl.call(this, emitted);
            if (fileURL) {
              replaceTo = fileURL;
            }
          }

          code = code.replace(m, replaceTo);
        } else {
          if (plugin.resolveImportMeta) {
            const replaceTo = plugin.resolveImportMeta.call(this, prop, {
              format: "es",
              moduleId: id,
              chunkId: id,
            });
            if (replaceTo) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              code = code.replace(m, replaceTo);
            }
          }
        }
      });

      if (transformChunk) {
        // renderChunk will not be called
        const ret = pickCode(await transformChunk.call(this, code, id, ssr));
        if (ret) {
          code = ret;
        }
      }
    }
    return code;
  }

  async function renderChunk(
    this: PluginContext,
    code: string,
    chunk: RenderedChunk,
    options: NormalizedOutputOptions,
  ) {
    if (plugin.renderChunk) {
      const ret = pickCode(await plugin.renderChunk.call(this, code, chunk, options));
      if (ret) {
        code = ret;
      }
    }

    if (transformChunk) {
      const ret = pickCode(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        await transformChunk.call(this, code, chunk.facadeModuleId || chunk.name, !!config.build.ssr),
      );
      if (ret) {
        code = ret;
      }
    }

    return {
      code: code,
    };
  }

  return new Proxy(
    {},
    {
      get(_: {}, prop: string): any {
        switch (prop) {
          case "configResolved":
            return function (this: PluginContext, c: ResolvedConfig) {
              config = c;
              if (plugin["configResolved"]) {
                return plugin["configResolved"].call(this, c);
              }
              return undefined;
            };
          case "transform": {
            return function fn(this: PluginContext, ...args: any[]) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              return transform.apply(withProxyContext(this), args as any);
            };
          }
          case "renderChunk": {
            return function fn(this: PluginContext, ...args: any[]) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              return renderChunk.apply(withProxyContext(this), args as any);
            };
          }
        }

        function fn(this: PluginContext, ...args: any[]) {
          return (plugin as any)[prop].apply(withProxyContext(this), args);
        }

        if (typeof (plugin as any)[prop] === "function") {
          return fn;
        }

        return (plugin as any)[prop];
      },
    },
  ) as any;
};
