## @querycap/babel-plugin-access-control-autocomplete

Autocomplete AccessControl React HoC.

When added access control for each Component, we may added some component as below:

```typescript jsx
import { mustAllOfPermissions } from "@querycap/access";
import { AcComponent2 } from "other";
import { useRequest, useTempDataForRequest } from "@querycap/request";
import { listApp, putApp } from "some-clients";

export const AcComponent = mustAllOfPermissions(
  AcComponent2,
  listApp,
  putApp,
)(() => {
  const [] = useRequest(putApp, {});
  const [] = useTempDataForRequest(listApp, {});

  return <AcComponent2 />;
});
```

but it will be boring and easy to make mistake.

with this plugin we could use special named component (`Ac(Every)Component` and `AcSomeComponet`) to autocomplete the `AccessControlComponent`.

the key of access control should be from request method, we could collect them by `use(\w+)?Request` or `useAc(\w+)` hooks or `create(\w+)?Request` HoC.
and `AccessControlComponent` will be composed too.

```typescript jsx
export const AcComponent = () => {
  const [] = useRequest(putApp, {});
  const [] = useTempDataForRequest(listApp, {});

  return <AcComponent2 />;
};
```

will be transform to

```typescript jsx
export const AcComponent = mustAllOfPermissions(
  AcComponent2,
  listApp,
  putApp,
)(() => {
  const [] = useRequest(putApp, {});
  const [] = useTempDataForRequest(listApp, {});

  return <AcComponent2 />;
});
```
