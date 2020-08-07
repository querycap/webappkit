# monobundle

working in monorepo which maintained by [lerna](https://github.com/lerna/lerna)
once `index.ts` exists in root folder of sub module
`monobundle` will take over the bundle flow.

## features

- rollup to bundle to single file, for `cjs` and `es`
  - with deps usage and missing checking.
- typescript transpile through babel
  - but typescript declaration through typescript, and use `rollup-plugin-dts` to merge to single `index.d.ts`
- respect the babel configuration of whole project
  - "monobundle": { "env":"browser" } of sub module could switch babel env as `ROLLUP_BROWSER`
