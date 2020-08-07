# DevKit

[![Build Status](https://img.shields.io/travis/querycap/devkit.svg?style=flat-square)](https://travis-ci.org/querycap/devkit)
[![codecov](https://codecov.io/gh/querycap/devkit/branch/master/graph/badge.svg)](https://codecov.io/gh/querycap/devkit)

## Environment

- Node 14+
- TypeScript Only
- No IE

## 项目结构

- 支持多个应用并行开发，便于公用模块的复用
- 通过 tag 触发 CI/CD 流程，`feat/<APP_NAME>[--<FEATURE>][.<ENV>]`

```
src-app/
    app-one/
        index.ts    # WebApp 入口文件
        config.ts   # 项目配置，详见「创建项目」
        index.html  # (可选) index 模板
        icon.png    # 和 config 中的 APP_MANIFEST 共同触发构建为 PWA
    app-two/
        index.tsx
        config.ts
helmx.project.yml
webpack.config.ts
package.json
```

## Setup

```
yarn add -W @querycap-dev/devkit
yarn devkit init
```

### 配置 webpack.config.ts

```typescript
import { withPresets } from "@querycap/webpack-preset";
import { withAssetsPreset } from "@querycap/webpack-preset-assets";
import { withHTMLPreset } from "@querycap/webpack-preset-html";
import { withTsPreset } from "@querycap/webpack-preset-ts";

export = withPresets(
  (c, state) => {
    console.log(state);
    // modify webpack configuration by yourself
  },
  withTsPreset(),
  withAssetsPreset(),
  withHTMLPreset(),
);
```

### 配置 package.json

```json5
{
  devkit: {
    build: "webpack --config webpack.config.ts",
    dev: "webpack-browser-sync --config webpack.config.ts --historyApiFallback --index=../index.html",
  },
}
```

### 创建项目

#### 配置 config.ts

```typescript
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

### 通过 app 和 env 进行项目切换

```
# 开发
yarn devkit dev <app[--feature]> [env]

# 打包
yarn devkit build <app[--feature]> [env]

# 压缩打包
yarn devkit build --prod <app[--feature]> [env]

# 发布
yarn devkit release <app[--feature]> [env]
```
