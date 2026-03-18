import type { Config } from "jest";

const config: Config = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testMatch: ["**/__tests__/**/*.{ts,tsx}", "**/*.{spec,test}.{ts,tsx}"],
  transformIgnorePatterns: [
    "node_modules/(?!(jest-expo|expo|@expo|react-native|@react-native|@apollo|react-native-auth0)/)",
  ],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/graphql/generated/**", // codegen output — not tested directly
  ],
};

export default config;
