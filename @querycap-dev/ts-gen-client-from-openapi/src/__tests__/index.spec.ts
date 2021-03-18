import * as fs from "fs";
import * as path from "path";
import petsOpenAPIJSON from "./examples/pets_v3";
import { writerOf } from "@querycap-dev/ts-gen-core";
import { clientScanner } from "../ClientScanner";

describe("ts-gen-client-from-swagger", () => {
  it("#toClientV3", () => {
    const writer = writerOf();

    clientScanner(writer, petsOpenAPIJSON, {
      clientId: "pets",
      clientLib: {
        path: "./utils",
        method: "createRequest",
      },
    });

    fs.writeFileSync(path.resolve(__dirname, "./examples/pets_v3__client.ts"), writer.output());
  });
});
