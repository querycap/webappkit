import { RouteTree } from "../RouteTree";

test("Route should build routes.tsx with correct pathname", () => {
  const rootRoute = RouteTree.path("/").withRoutes(RouteTree.path("home"), RouteTree.path("about"));

  expect(rootRoute.routes[0].path).toBe("/home");
  expect(rootRoute.routes[0].parents()).toHaveLength(1);
});
