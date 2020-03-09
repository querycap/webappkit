# DevKit

[![Build Status](https://img.shields.io/travis/querycap/devkit.svg?style=flat-square)](https://travis-ci.org/querycap/devkit)
[![codecov](https://codecov.io/gh/querycap/devkit/branch/master/graph/badge.svg)](https://codecov.io/gh/querycap/devkit)

## Environment

- Node 12+
- No IE

## 项目结构

- 支持多个应用并行开发，便于公用模块的复用
- 通过 tag 触发 CI/CD 流程，`feat/<APP_NAME>[--<FEATURE>][.<ENV>]`

```
src-app/
    app-one/
        index.tsx
        config.ts
        index.html  # 可选
        icon.png    # 和 config 中的 APP_MANIFEST 共同触发构建为 PWA
    app-two/
        index.tsx
        config.ts
helmx.project.yml
webpack.config.ts
package.json
```

```typescript
// webpack.config.ts

import { release, withPresetsBy } from "@querycap/webpack-preset";
import { withAssetsPreset } from "@querycap/webpack-preset-assets";
import { withHTMLPreset } from "@querycap/webpack-preset-html";
import { withTsPreset } from "@querycap/webpack-preset-ts";

export = withPresetsBy({
  cwd: __dirname,
})(
  (_, state) => {
    console.log(state);

    if (process.env.TO_RELEASE) {
      release(state);
    }
  },
  withTsPreset(),
  withAssetsPreset(),
  withHTMLPreset(),
);
```

```json5
// package.json
// 对应的 scripts 需要包含

{
  scripts: {
    pkg: "NODE_ENV=production npm run build",
    build: "webpack --config webpack.config.ts",
    dev: "webpack-browser-sync --config webpack.config.ts --historyApiFallback --index=../index.html",
    r: "TO_RELEASE=1 ts-node ./webpack.config.ts",
  },
}
```

- 通过环境变量 `APP` 和 `ENV`，我们可以进行切换应用或者项目 \*
  如 `APP=app-one ENV=demo npm run dev`

```
如下文件会自动生成并覆盖

.gitlab-ci.yml
dockerfile.default.yml
helmx.default.yml
site.template
web-entrypoint.sh
```

```yaml
# helmx.project.yml
project:
  name: web-${APP}
  feature: "${PROJECT_FEATURE}"
  group: gis
  version: 0.0.0
```

```typescript
// src-app/<APP_NAME>/config.ts
import { confLoader } from "@querycap/config";

// 部署环境列表，会处理为全小写
// 默认使用 第一个
export enum ENVS {
  STAGING = "STAGING",
  TEST = "TEST",
  DEMO = "DEMO",
  ONLINE = "ONLINE",
  LOCAL = "LOCAL",
}

export const APP_MANIFEST = {
  name: "测试",
  background_color: "#19C7B1",
  crossorigin: "use-credentials",
};

export const APP_CONFIG = {
  SRV_TEST: (env: string, feature: string) => {
    if (env === "local") {
      return `//127.0.0.1:80`;
    }

    if (feature === "demo") {
      return `//api.demo.com`;
    }

    return `//api.com`;
  },
};

// conf() 将返回从 meta 中读取的配置信息，也方便在容器中注入
// 另外，当应用以插件的形式使用的时候，也方便对应页面配置
// <meta name="devkit:app" content="appName=demo,env=demo,version=__PROJECT_VERSION__">
// <meta name="devkit:config" content="SRV_TEST=//demo.querycap.com">
export const conf = confLoader<keyof typeof APP_CONFIG>();
```
