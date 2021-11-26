# Farewell Webpack

随着 Web 应用体量的增长，需要处理的代码量也随之增长，Webpack 的机制 —— 加载所有模块（即使有缓存）进行打包再提供， 已经显得力不从心。

随着浏览器原生支持 ES 模块（包括在 Web Worker 中）， 至少在开发阶段，我们已经不再需要模块打包。

当然，由于 JSX 和其他预编译的需求的存在，对每个文件进行单独转换的需求依然存在。 而在最终生产环境，浏览器版本多样，对语言特性的支持并不都是完整， 部署所需的代码，依然需要降级处理或者添加 Polyfill。

基于上述背景，Vite 及其背靠的 Rollup 生态，可以更好地满足我们的 Web 应用开发和构建需求。

## Vite 的两种形态

### `vite build`

这一形态，基本就是 `rollup build`，但由于 Vite 插件 `enforce` 和 `apply` 的配置，最终生效的插件和顺序需要注意。 如果要定义最终构建过程，我们可以完全当做 Rollup 来配置或者开发 Plugin.

插件的生命周期两个阶段:

* `build`: <https://rollupjs.org/guide/en/#build-hooks>
* `output-generation`: <https://rollupjs.org/guide/en/#output-generation-hooks>

### `vite serve`

在这一形态下, vite 没有 `output-generation` 阶段，并是根据请求文件地址，找到并直接返回文件内容， 当然如果需要预编译，也会触发 Rollup 的 `build` Hooks.

所以，当我们企图直接使用 Rollup 的插件，如果该插件使用到了  `refID = this.emitFile({})` 和 `import.meta.ROLLUP_FILE_URL_${refID}`
（会通过 `output-generation` 阶段的 [`resolveFileUrl` Hook](https://rollupjs.org/guide/en/#resolvefileurl) 替换成对应生成文件) ，

该插件 Rollup 是无法在 `vite serve` 这一形态生效的。

虽然，Vite 提供了额外的占位符 `__VITE_ASSET__${hash}__`，但我们可以有更好的方式， 去做到 Rollup 插件 的兼容 —— 利用 `build`
阶段的 [`transform` Hook](https://rollupjs.org/guide/en/#transform)

当处于 `vite serve` 形态时，我们调用 `resolveFileUrl`/`resolveImportMeta` 和 `renderChunk`， 并且在注册 Rollup 插件 的时候，代理一下 `emitFile`
，这样便可基本能做到兼容 Rollup 插件 了。

## 生产构建

### 需要 ES5 怎么办？Babel 正值当年！

这点和 Webpack 一样，我们只需要让 Babel 帮我们将代码转换为 ES5 和 ESModule 的代码即可。 这样只是多了一步预编译罢了，并不会太破坏 Vite 的机制，两种形态均适用。

```ts
import { babel as rollupBabel } from "@rollup/plugin-babel";

export default defineConfig[{
  plugins: [
    {
      // 非常需要注意这里，要在确保在 Vite 核心插件前运行
      enforce: "pre",
      ...rollupBabel({
        babelrc: true,
        babelHelpers: "runtime",
        exclude: "node_modules/**",
      }),
    }
  ]
}]
```

### 不支持 ES 模块怎么办？ AMD/RequireJS 尚能饭否！

首先 `vite serve` 形态是不需要的， 只需要再 `vite build` 形态做修改即可，当然，编写为 Rollup 插件可以让使用更方便。

```ts

export default outputAMD = () => {
  let config
  let requireJSRef

  return {
    name: "my-vite-plugin/output-amd",

    configResolved(c) {
      config = c;
    },

    // 构建开始打首先打包好 request.js
    async buildStart() {
      if (config.command !== "build") {
        return undefined;
      }

      const data = await transformRequireJS();

      requireJSRef = this.emitFile({
        name: "require.js",
        source: data.code,
        type: "asset",
      });

      return undefined;
    },

    // 修改 rollup 的 output format 为 amd
    outputOptions(o) {
      if (config.command !== "build") {
        return undefined;
      }

      o.format = "amd";
      o.amd = {
        autoId: true,
      };
      return o;
    },

    // 替换 index html 的 js 文件并额外插入 require.js 依赖
    transformIndexHtml(html, { bundle }) {
      if (config.command !== "build") {
        return undefined;
      }

      const entryFile = getEntry(bundle);
      const requireJSFile = getFilenameByName(bundle, "require.js");

      const $ = cheerio.load(html, {});

      $(`script[type=module]`).remove();
      $(`link[rel=modulepreload]`).remove();

      $("head").append(`<script src="${config.base}${requireJSFile}"></script>`);
      $("body").append(`<script src="${config.base}${entryFile}"></script>`);

      return $.html();
    },

    // 入口文件需要调用一下对应模块，并配置 baseUrl
    renderChunk(code: string, chunk: RenderedChunk, options: NormalizedOutputOptions) {
      if (options.format === "amd" && chunk.isEntry) {
        let prefix = "";
        let params = paramsOf(chunk.facadeModuleId || "")

        // 在 web worker 
        // 同样需要插入 require.js 依赖, 通过 importScripts 
        if (params.has("worker")) {
          prefix = `importScripts("${config.base}${this.getFileName(requireJSRef)}");`;
          // 由于 amd 生成代码有 define wrap 的存在，
          // 我们确保 onmessage 在文件 root 上
          // `self.addEventListener('message', (evt) => {})` 或者 `self.onmessage = (evt) => {}`
          code = hoistOnMessage(code)
        }
        return `
${prefix}                
requirejs.config({ baseUrl: "${config.base}" });        
${code}
require(["${chunk.fileName.replace(/\.js$/, "")}"]);       
       `;
      }
      return code;
    },
  }
}
```

## 杂项

* 图片字体等，已内置
* VendorGroups: 可以通过实现 <https://rollupjs.org/guide/en/#outputmanualchunks>
* PWA: <https://github.com/antfu/vite-plugin-pwa>
* MonacoEditor: <https://github.com/vitejs/vite/discussions/1791#discussioncomment-321046>

