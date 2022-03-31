import { transformSync } from "@babel/core";
import accessControlAutocomplete from "@querycap/babel-plugin-access-control-autocomplete";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const compileToSnapshot = (code: string) => {
  const t = transformSync(code, {
    root: __dirname,
    parserOpts: {
      plugins: ["jsx"],
    },
    plugins: [[accessControlAutocomplete, { libAccessControl: "@querycap/access" }]],
  });

  return `
${code}
    
↓ ↓ ↓ ↓ ↓ ↓

${t?.code}  
`;
};

describe("babel-plugin-access-control-autocomplete", () => {
  it("should skip mark if marked", () => {
    const result = compileToSnapshot(`
import { mustAllOfPermissions } from "@querycap/access"; 
const AcComponent = mustAllOfPermissions()(() => null);
`);
    expect(result).toMatchSnapshot();
  });

  it("should mark", () => {
    const result = compileToSnapshot(`
export const AcComponent = hoc()(() => null);
export const AcSomeComponent = create(() => null);
`);

    expect(result).toMatchSnapshot();
  });

  it("should mark with access control component", () => {
    const result = compileToSnapshot(`
export const AcComponent = () => <div>
  <AcComponent />
  <AcComponent2 />
</div>;
`);

    expect(result).toMatchSnapshot();
  });

  it("should mark with hook arg and useAcX", () => {
    const result = compileToSnapshot(`
import { mustAllOfPermissions } from "@querycap/access";
const useAcHook = () => useTempDataForRequest(listApp, {});
export const AcComponent = () => {
  useRequest(putApp, {});
  useTempDataForRequest(listApp, {});
  useAcHook();
  return null;
};
`);

    expect(result).toMatchSnapshot();
  });

  it("should mark with createXRequest hoc arg", () => {
    const result = compileToSnapshot(`
export const AcComponent = createSearchInputOfRequest(listApp)(() => null);
export const AcComponent2 = createSearchInputOfRequest(listApp, {});
`);

    expect(result).toMatchSnapshot();
  });

  it("should mark mixed", () => {
    const result = compileToSnapshot(`
export const AcComponent = () => {
  useRequest(putApp, {});
  useTempDataForRequest(listApp, {})
  return <AcComponent2 />;
};
`);

    expect(result).toMatchSnapshot();
  });
});
