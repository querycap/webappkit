import { transform } from "@babel/core";
import accessControlAutocomplete from "../";

describe("test cases", () => {
  it("should skip mark if marked", () => {
    expect(
      transformCode(`
import { mustAllOfPermissions } from "@querycap/access"; 
const AcComponent = mustAllOfPermissions()(() => null);
`),
    ).toEqual(
      unPad(`
import { mustAllOfPermissions } from "@querycap/access";
const AcComponent = mustAllOfPermissions()(() => null);
`),
    );
  });

  it("should mark", () => {
    expect(
      transformCode(`
export const AcComponent = hoc()(() => null);
export const AcSomeComponent = create(() => null);
    `),
    ).toEqual(
      unPad(`
import { mustAllOfPermissions } from "@querycap/access";
import { mustOneOfPermissions } from "@querycap/access";
export const AcComponent = mustAllOfPermissions()(hoc()(() => null));
export const AcSomeComponent = mustOneOfPermissions()(create(() => null));
`),
    );
  });

  it("should mark with access control component", () => {
    expect(
      transformCode(`
export const AcComponent = () => <div>
  <AcComponent />
  <AcComponent2 />
</div>;
    `),
    ).toEqual(
      unPad(`
import { mustAllOfPermissions } from "@querycap/access";
export const AcComponent = mustAllOfPermissions(AcComponent2)(() => <div>
  <AcComponent />
  <AcComponent2 />
</div>);
`),
    );
  });

  it("should mark with useXRequest hook arg and useAcX", () => {
    expect(
      transformCode(`
import { mustAllOfPermissions } from "@querycap/access";
const useAcHook = () => useTempDataForRequest(listApp, {});
export const AcComponent = () => {
  useRequest(putApp, {});
  useTempDataForRequest(listApp, {});
  useAcHook();
  return null;
};
`),
    ).toEqual(
      unPad(`
import { mustAllOfPermissions } from "@querycap/access";
const useAcHook = mustAllOfPermissions(listApp)(() => useTempDataForRequest(listApp, {}), true);
export const AcComponent = mustAllOfPermissions(listApp, putApp, useAcHook)(() => {
  useRequest(putApp, {});
  useTempDataForRequest(listApp, {});
  useAcHook();
  return null;
});`),
    );
  });

  it("should mark with createXRequest hoc arg", () => {
    expect(
      transformCode(`
export const AcComponent = createSearchInputOfRequest(listApp)(() => null);
export const AcComponent2 = createSearchInputOfRequest(listApp, {});
`),
    ).toEqual(
      unPad(`
import { mustAllOfPermissions } from "@querycap/access";
export const AcComponent = mustAllOfPermissions(listApp)(createSearchInputOfRequest(listApp)(() => null));
export const AcComponent2 = mustAllOfPermissions(listApp)(createSearchInputOfRequest(listApp, {}));
`),
    );
  });

  it("should mark mixed", () => {
    expect(
      transformCode(`
export const AcComponent = () => {
  useRequest(putApp, {});
  useTempDataForRequest(listApp, {})
  return <AcComponent2 />;
};
`),
    ).toEqual(
      unPad(`
import { mustAllOfPermissions } from "@querycap/access";
export const AcComponent = mustAllOfPermissions(AcComponent2, listApp, putApp)(() => {
  useRequest(putApp, {});
  useTempDataForRequest(listApp, {});
  return <AcComponent2 />;
});`),
    );
  });
});

function transformCode(src: string): string {
  return unPad(
    transform(src, {
      root: __filename,
      parserOpts: {
        plugins: ["jsx"],
      },
      plugins: [[accessControlAutocomplete, { libAccessControl: "@querycap/access" }]],
    })!.code || "",
  );
}

function unPad(str: string) {
  return str
    .replace(/^\n+|\n+$/, "")
    .replace(/\n+/g, "\n")
    .trim();
}
