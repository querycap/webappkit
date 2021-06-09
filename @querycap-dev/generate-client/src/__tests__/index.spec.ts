import { join } from "path";
import { generateClient } from "..";

test("generate-client", async () => {
  const opt = {
    cwd: join(__dirname, "./.tmp"),
    clientCreator: "../../../request.createRequest",
    force: true,
  };

  await generateClient("idp", "https://srv-idp---idp.hw-dev.rktl.xyz/idp", opt);
});
