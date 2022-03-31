import { scan } from "../Scanner";
// @ts-ignore
import schemaJSON from "../spec/schema.json";
import fs from "fs";
import path from "path";
import { writerOf } from "@querycap-dev/ts-gen-core";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("#toSchema", () => {
  const writer = writerOf();

  scan(writer, schemaJSON as any);

  fs.writeFileSync(path.resolve(__dirname, "../Schema.ts"), `${writer.output()}\n`);
});
