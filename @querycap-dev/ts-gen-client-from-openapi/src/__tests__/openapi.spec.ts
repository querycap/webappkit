import { ISchemaBasic, scan, simplifySchema } from "@querycap-dev/ts-gen-definitions-from-json-schema";
import { writerOf } from "@querycap-dev/ts-gen-core";
import * as fs from "fs";
import * as path from "path";
// @ts-ignore
import schemaJSON from "../spec/schema.json";
// @ts-ignore
import openApiJSON from "../spec/openapi.json";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

test("#toOpenAPI", () => {
  const mergedSchema = simplifySchema(
    {
      ...openApiJSON,
      $id: "OpenAPI",
      id: undefined,
    } as any,
    {
      "http://json-schema.org/draft-04/schema": schemaJSON as ISchemaBasic,
    },
  );

  const writer = writerOf();

  scan(writer, mergedSchema);

  fs.writeFileSync(path.resolve(__dirname, "../OpenAPI.ts"), `${writer.output()}\n`);
});
