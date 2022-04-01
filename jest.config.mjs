export default {
  "testEnvironment": "jsdom",
  "maxConcurrency": 10,
  "transform": {
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
  "moduleNameMapper": {
    "^@querycap/lodash$": "<rootDir>/@querycap/lodash/lodash.mjs",
    "^@querycap-dev/babel-preset": "<rootDir>/@querycap-dev/babel-preset/index.mjs",

    "^@reactorx/([^/]+)$": "<rootDir>/@reactorx/$1/index.ts",
    "^@querycap-dev/([^/]+)$": "<rootDir>/@querycap-dev/$1/index.ts",
    "^@querycap/([^/]+)$": "<rootDir>/@querycap/$1/index.ts",
    "^@querycap-ui/([^/]+)$": "<rootDir>/@querycap-ui/$1/index.ts",

    // https://github.com/facebook/jest/issues/12270
    "#ansi-styles": "chalk/source/vendor/ansi-styles/index.js",
    "#supports-color": "chalk/source/vendor/supports-color/index.js",
  },
  "moduleFileExtensions": [
    "tsx",
    "ts",
    "json",
    "jsx",
    "js",
  ],
  "extensionsToTreatAsEsm": [
    ".tsx",
    ".ts",
  ],
  "modulePaths": [
    "<rootDir>",
  ],
  "testPathIgnorePatterns": [
    "/node_modules/",
    "<rootDir>/@@deprecated/",
  ],
  "testRegex": ".*/__tests__/.+\\.(generator|test|spec)\\.(ts|tsx)$",
};