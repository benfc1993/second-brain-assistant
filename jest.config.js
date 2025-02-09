/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  setupFiles: ["./test-env.ts"],
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  // testNamePattern: ".*.test.ts",
};

