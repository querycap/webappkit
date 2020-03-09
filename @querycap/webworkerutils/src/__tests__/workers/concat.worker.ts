import { createWorker } from "@querycap/webworkerutils";

export default createWorker(({ values }: { values: string[] }) => values.join("."));
