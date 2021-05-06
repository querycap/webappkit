// eslint-disable-next-line no-undef,@typescript-eslint/no-var-requires
const rootPkg = require("./package.json");

// eslint-disable-next-line no-undef
module.exports = {
  hooks: {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    readPackage(pkg, context) {
      for (const n in rootPkg.pnpm.overrides) {
        if (pkg.dependencies && pkg.dependencies[n]) {
          pkg.dependencies[n] = rootPkg.pnpm.overrides[n];
        }
      }
      return pkg;
    },
  },
};
