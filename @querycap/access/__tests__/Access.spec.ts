import { fromOAuthToken, hasLogon } from "@querycap/access";

describe("#AccessToken", () => {
  describe("expires_in", () => {
    it("valid", () => {
      const t = fromOAuthToken({
        token_type: "bearer",
        access_token: "111",
        refresh_token: "111",
        expires_in: 3600,
      });

      expect(hasLogon(t)).toBe(true);
    });

    it("invalid", () => {
      const t = fromOAuthToken({
        token_type: "bearer",
        access_token: "111",
        refresh_token: "111",
        expires_in: -1,
      });

      expect(hasLogon(t)).toBe(false);
    });
  });
});
