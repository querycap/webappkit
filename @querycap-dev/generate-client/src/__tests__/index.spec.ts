import { dirname, join } from "path";
import { generateClient } from "..";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

test.skip("generate-client", async () => {
  const opt = {
    cwd: join(__dirname, "./.tmp"),
    clientCreator: "../../../request.createRequest",
    force: true,
  };

  await generateClient("idp", "https://srv-idp---idp.hw-dev.rktl.xyz/idp", opt);
});
