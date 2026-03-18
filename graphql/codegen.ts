import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  // Consumes the exported SDL from tachyon-api
  // Locally: ensure `npm run schema:export` has been run in tachyon-api first
  // CI: resolved via relative path with sibling repo checkout
  schema: process.env.GRAPHQL_SCHEMA_PATH ?? "../tachyon-api/schema.graphql",
  documents: ["./graphql/operations/**/*.graphql"],
  generates: {
    "./generated/": {
      preset: "client",
      presetConfig: {
        gqlTagName: "gql",
        fragmentMasking: false,
      },
      plugins: [],
    },
  },
  hooks: {
    afterAllFileWrite: ["npx prettier --write"],
  },
};

export default config;
