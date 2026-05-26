import { type ThemeColors } from "@/constants/theme";
import { type BotQuery } from "@/generated/graphql";
import { useRouter } from "expo-router";
import React from "react";
import { DailyCapProgressBar } from "../../components/DailyCapProgressBar";
import { SecondaryButton } from "../../components/SecondaryButton";
import { StatRow } from "../../components/StatRow";

type Agent = NonNullable<BotQuery["bot"]>;
interface TachyonHostedProps {
  agent: Agent;
  theme: ThemeColors;
}
const SCAN_CAP_TACHYON_HOSTED = 78;

export const TachyonHosted = ({ agent, theme }: TachyonHostedProps) => {
  const router = useRouter();
  const used = agent.scanCapUsed ?? 0;
  const remaining = agent.scanCapRemaining ?? SCAN_CAP_TACHYON_HOSTED;

  return (
    <>
      <StatRow
        label="Daily Scan Cap"
        value={`${SCAN_CAP_TACHYON_HOSTED} scans/day`}
        theme={theme}
      />
      <DailyCapProgressBar scanCapUsed={used} scanCapRemaining={remaining} />
      <SecondaryButton
        label="Switch to BYOK"
        onPress={() => router.push("/(subscription)/tier-selection" as never)}
        theme={theme}
      />
    </>
  );
};
