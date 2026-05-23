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
      config: {
        // For enums that are authoritative in tachyon-queue-types, import directly
        // from that package so generated code and WizardState share the exact same type.
        enumValues: {
          BotFrame:
            "@tachyonapp/tachyon-queue-types/config#BotFrameName",
          RiskAttitude:
            "@tachyonapp/tachyon-queue-types/config#RiskAttitude",
          TradeTempo:
            "@tachyonapp/tachyon-queue-types/config#TradeTempo",
          CombatPatience:
            "@tachyonapp/tachyon-queue-types/config#CombatPatience",
          ConfidenceThreshold:
            "@tachyonapp/tachyon-queue-types/config#ConfidenceThreshold",
          RegimeAwareness:
            "@tachyonapp/tachyon-queue-types/config#RegimeAwareness",
          EarningsBehavior:
            "@tachyonapp/tachyon-queue-types/config#EarningsBehavior",
          DividendPreference:
            "@tachyonapp/tachyon-queue-types/config#DividendPreference",
          ShortInterestSignal:
            "@tachyonapp/tachyon-queue-types/config#ShortInterestSignal",
          PositionSizingMethod:
            "@tachyonapp/tachyon-queue-types/config#PositionSizingMethod",
          RecoveryMode: "@tachyonapp/tachyon-queue-types/config#RecoveryMode",
          SessionPreference:
            "@tachyonapp/tachyon-queue-types/config#SessionPreference",
          DayOfWeek: "@tachyonapp/tachyon-queue-types/config#DayOfWeek",
          VolatilityEnvPreference:
            "@tachyonapp/tachyon-queue-types/config#VolatilityEnvPreference",
          ProposalCommunicationStyle:
            "@tachyonapp/tachyon-queue-types/config#ProposalCommunicationStyle",
        },
      },
    },
  },
  hooks: {
    afterAllFileWrite: ["npx prettier --write"],
  },
};

export default config;
