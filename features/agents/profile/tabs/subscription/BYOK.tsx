import { type ThemeColors } from "@/constants/theme";
import { type BotQuery } from "@/generated/graphql";
import { useRouter } from "expo-router";

import { SecondaryButton } from "../../components/SecondaryButton";
import { StatRow } from "../../components/StatRow";

type Agent = NonNullable<BotQuery["bot"]>;

interface ByokProps {
  agent: Agent;
  theme: ThemeColors;
}

export const Byok = ({ agent, theme }: ByokProps) => {
  const router = useRouter();
  const config = agent.botBrainConfig;
  const provider = config?.provider ?? "Unknown";
  const keyPreview = config?.keyPreview;
  const keyConfigured = keyPreview != null;

  return (
    <>
      <StatRow label="Brain" value={`Your Key — ${provider}`} theme={theme} />
      <StatRow
        label="Key Status"
        value={keyConfigured ? "Active" : "Not Configured"}
        theme={theme}
      />
      {keyConfigured && (
        <StatRow
          label="Key Preview"
          value={`•••• ${keyPreview}`}
          theme={theme}
        />
      )}
      <StatRow label="Daily Scan Cap" value="Unlimited" theme={theme} />
      <SecondaryButton
        label="Manage API Key"
        onPress={() => router.push("/(bot-forge)/brain" as never)}
        theme={theme}
      />
    </>
  );
};
