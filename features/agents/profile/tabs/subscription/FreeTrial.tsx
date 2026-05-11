import { type ThemeColors } from "@/constants/theme";
import { type BotQuery } from "@/generated/graphql";
import { useRouter } from "expo-router";
import React from "react";
import { PrimaryButton } from "../../components/PrimaryButton";
import { ScanCapBar } from "../../components/ScanCapBar";
import { StatRow } from "../../components/StatRow";

type Agent = NonNullable<BotQuery["bot"]>;

interface FreeTrialProps {
  agent: Agent;
  theme: ThemeColors;
}

const SCAN_CAP_FREE_TRIAL = 40;

export const FreeTrial = ({ agent, theme }: FreeTrialProps) => {
  const router = useRouter();
  const used = agent.scanCapUsed ?? 0;
  const remaining = agent.scanCapRemaining ?? SCAN_CAP_FREE_TRIAL;

  return (
    <>
      <StatRow label="Brain" value="Tachyon Haiku (Free Trial)" theme={theme} />
      <StatRow
        label="Daily Scan Cap"
        value={`${SCAN_CAP_FREE_TRIAL} scans/day`}
        theme={theme}
      />
      <StatRow label="Scans Used Today" value={String(used)} theme={theme} />
      <StatRow
        label="Scans Remaining"
        value={String(remaining)}
        theme={theme}
      />
      <ScanCapBar used={used} cap={SCAN_CAP_FREE_TRIAL} theme={theme} />
      <PrimaryButton
        label="Unlock more daily market scans"
        onPress={() => router.push("/(subscription)/tier-selection" as never)}
        theme={theme}
      />
    </>
  );
};
