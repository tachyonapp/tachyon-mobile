import { type ThemeColors } from "@/constants/theme";
import { type BotQuery } from "@/generated/graphql";
import { useRouter } from "expo-router";
import React from "react";
import { PrimaryButton } from "../../components/PrimaryButton";
import { ScanCapBar } from "../../components/ScanCapBar";
import { StatRow } from "../../components/StatRow";

type Bot = NonNullable<BotQuery["bot"]>;

const SCAN_CAP_FREE_TRIAL = 40;

export const FreeTrial = ({ bot, theme }: { bot: Bot; theme: ThemeColors }) => {
  const router = useRouter();
  const used = bot.scanCapUsed ?? 0;
  const remaining = bot.scanCapRemaining ?? SCAN_CAP_FREE_TRIAL;

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
