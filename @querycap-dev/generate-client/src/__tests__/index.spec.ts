import { join } from "path";
import { generateClient, generateClientFromConfig } from "..";

test.skip("generate-client", async () => {
  const opt = {
    cwd: join(__dirname, "./.tmp"),
    clientCreator: "../../../request.createRequest",
    force: true,
  };

  await generateClient("idp", "https://api.demo.querycap.com/idp", opt);

  await generateClientFromConfig(
    {
      SRV_IDP: "//api.demo.querycap.com",
    },
    opt,
  );
});
