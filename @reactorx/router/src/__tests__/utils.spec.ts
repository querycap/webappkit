import { generatePath, matchPath } from "../utils";

describe("matchPath", () => {
  describe('with path="/"', () => {
    it('returns correct url at "/"', () => {
      const path = "/";
      const pathname = "/";
      const match = matchPath(pathname, path);
      expect(match!.url).toBe("/");
    });

    it('returns correct url at "/" with location search ignored', () => {
      const path = "/a?query=1";
      const pathname = "/a";
      const match = matchPath(pathname, path);
      expect(match!.url).toBe("/a");
    });

    it('returns correct url at "/somewhere/else"', () => {
      const path = "/";
      const pathname = "/somewhere/else";
      const match = matchPath(pathname, path);
      expect(match!.url).toBe("/");
    });

    it("wild match", () => {
      const path = "(.*)";
      const pathname = "/somewhere/else";
      const match = matchPath(pathname, path);

      expect(match!.url).toBe("/somewhere/else");
    });
  });

  describe('with path="/somewhere"', () => {
    it('returns correct url at "/somewhere"', () => {
      const path = "/somewhere";
      const pathname = "/somewhere";
      const match = matchPath(pathname, path);
      expect(match!.url).toBe("/somewhere");
    });

    it('returns correct url at "/somewhere/else"', () => {
      const path = "/somewhere";
      const pathname = "/somewhere/else";
      const match = matchPath(pathname, path);
      expect(match!.url).toBe("/somewhere");
    });
  });

  describe("with an array of paths", () => {
    it('return the correct url at "/elsewhere"', () => {
      const path = ["/somewhere", "/elsewhere"];
      const pathname = "/elsewhere";
      const match = matchPath(pathname, { path });
      expect(match!.url).toBe("/elsewhere");
    });

    it('returns correct url at "/elsewhere/else"', () => {
      const path = ["/somewhere", "/elsewhere"];
      const pathname = "/elsewhere/else";
      const match = matchPath(pathname, { path });
      expect(match!.url).toBe("/elsewhere");
    });

    it('returns correct url at "/elsewhere/else" with path "/" in array', () => {
      const path = ["/somewhere", "/"];
      const pathname = "/elsewhere/else";
      const match = matchPath(pathname, { path });
      expect(match!.url).toBe("/");
    });

    it('returns correct url at "/somewhere" with path "/" in array', () => {
      const path = ["/somewhere", "/"];
      const pathname = "/somewhere";
      const match = matchPath(pathname, { path });
      expect(match!.url).toBe("/somewhere");
    });
  });

  describe("with sensitive path", () => {
    it("returns non-sensitive url", () => {
      const options = {
        path: "/SomeWhere",
      };
      const pathname = "/somewhere";
      const match = matchPath(pathname, options);
      expect(match!.url).toBe("/somewhere");
    });

    it("returns sensitive url", () => {
      const options = {
        path: "/SomeWhere",
        sensitive: true,
      };
      const pathname = "/somewhere";
      const match = matchPath(pathname, options);
      expect(match).toBe(null);
    });
  });

  describe("cache", () => {
    it("creates a cache entry for each exact/strict pair", () => {
      // true/false and false/true will collide when adding booleans
      const trueFalse = matchPath("/one/two", {
        path: "/one/two",
        exact: true,
        strict: false,
      });

      const falseTrue = matchPath("/one/two", {
        path: "/one/two/",
        exact: false,
        strict: true,
      });

      expect(!!trueFalse).toBe(true);
      expect(!!falseTrue).toBe(false);
    });
  });
});

describe("generatePath", () => {
  describe('with pattern="/"', () => {
    it("returns correct url with no params", () => {
      const pattern = "/";
      const generated = generatePath(pattern);
      expect(generated).toBe("/");
    });

    it("returns correct url with params", () => {
      const pattern = "/";
      const params = { foo: "tobi", bar: 123 };
      const generated = generatePath(pattern, params);
      expect(generated).toBe("/");
    });
  });

  describe('with pattern="/:foo/somewhere/:bar"', () => {
    it("throws with no params", () => {
      const pattern = "/:foo/somewhere/:bar";
      expect(() => {
        generatePath(pattern);
      }).toThrow();
    });

    it("throws with some params", () => {
      const pattern = "/:foo/somewhere/:bar";
      const params = { foo: "tobi", quux: 999 };
      expect(() => {
        generatePath(pattern, params);
      }).toThrow();
    });

    it("returns correct url with params", () => {
      const pattern = "/:foo/somewhere/:bar";
      const params = { foo: "tobi", bar: 123 };
      const generated = generatePath(pattern, params);
      expect(generated).toBe("/tobi/somewhere/123");
    });

    it("returns correct url with additional params", () => {
      const pattern = "/:foo/somewhere/:bar";
      const params = { foo: "tobi", bar: 123, quux: 999 };
      const generated = generatePath(pattern, params);
      expect(generated).toBe("/tobi/somewhere/123");
    });
  });

  describe("with no path", () => {
    it("matches the root URL", () => {
      const generated = generatePath();
      expect(generated).toBe("/");
    });
  });

  describe('simple pattern="/view/:id"', () => {
    it("handle = on params", () => {
      const pattern = "/view/:id";
      const params = { id: "Q29tcGxhaW50OjVhZjFhMDg0MzhjMTk1MThiMTdlOTQ2Yg==" };

      const generated = generatePath(pattern, params);
      expect(generated).toBe("/view/Q29tcGxhaW50OjVhZjFhMDg0MzhjMTk1MThiMTdlOTQ2Yg%3D%3D");
    });
  });
});
