# @querycap/webworker-utils

webwoker helpers

## Usage

```typescript
// in worker
// ./workers/action.worker.ts
import { createWorker } from "@querycap/webworkerutils";

export default createWorker((opt: { }) => ""));
```

```typescript
import { withWorker } from "@querycap/webworkerutils";

// type safe promise
export const do = withWorker(() => import("./workers/action.worker"));
```
