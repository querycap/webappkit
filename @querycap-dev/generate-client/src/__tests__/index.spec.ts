import { join } from "path";
import { generateClient } from "..";

test.skip("generate-client", async () => {
  const opt = {
    cwd: join(__dirname, "./.tmp"),
    clientCreator: "../../../request.createRequest",
    force: true,
  };

  await generateClient("idp", "https://srv-octohelm---octohelm.hw-dev.rktl.xyz/octohelm", opt);
});
