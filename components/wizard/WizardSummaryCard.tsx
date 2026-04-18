import { FRAME_CONFIG } from "@/constants/frameConfig";
import { Colors } from "@/constants/theme";
import { type WizardState } from "@/context/WizardContext";
import { BrainType } from "@/generated/graphql";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface WizardSummaryCardProps {
  state: WizardState;
  userCashBalance: number;
  isKeyValidated: boolean;
}

function formatUsd(amount: number): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function maskApiKey(key: string | null): string {
  if (!key || key.length < 4) return "••••";
  return `••••${key.slice(-4)}`;
}

function SectionHeader({
  title,
  route,
}: {
  title: string;
  route: string;
}) {
  const router = useRouter();
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Pressable onPress={() => router.push(route as never)} hitSlop={8}>
        <Text style={styles.editLink}>Edit</Text>
      </Pressable>
    </View>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export function WizardSummaryCard({
  state,
  userCashBalance,
  isKeyValidated,
}: WizardSummaryCardProps) {
  const frameConfig = state.frameName ? FRAME_CONFIG[state.frameName] : null;
  const allocationUsd =
    userCashBalance > 0
      ? formatUsd(state.allocationPct * userCashBalance)
      : null;
  const lossUsd =
    userCashBalance > 0
      ? formatUsd(state.dailyMaxLoss * (state.allocationPct * userCashBalance))
      : null;

  return (
    <View style={styles.container}>
      {/* Frame */}
      <View style={styles.section}>
        <SectionHeader title="Frame" route="/(bot-wizard)/frame" />
        {frameConfig && (
          <View style={styles.frameRow}>
            <View style={[styles.colorwayDot, { backgroundColor: frameConfig.colorway }]} />
            <Text style={styles.rowValue}>{frameConfig.gamifiedName}</Text>
            <Text style={styles.rowLabel}> — {frameConfig.strategyName}</Text>
          </View>
        )}
      </View>

      {/* Training */}
      <View style={styles.section}>
        <SectionHeader title="Training" route="/(bot-wizard)/risk" />
        <Row label="Risk Attitude" value={state.riskAttitude ?? "—"} />
        <Row label="Trade Tempo" value={state.tradeTempo ?? "—"} />
        <Row label="Combat Patience" value={state.combatPatience ?? "—"} />
        <Row
          label="Market Awareness"
          value={[
            `M ${state.marketAwareness.momentum.toFixed(2)}`,
            `MR ${state.marketAwareness.meanReversion.toFixed(2)}`,
            `V ${state.marketAwareness.volatility.toFixed(2)}`,
            `TF ${state.marketAwareness.trendFollowing.toFixed(2)}`,
          ].join(" · ")}
        />
        <Row label="Exit Personality" value={state.exitPersonality?.name ?? "—"} />
      </View>

      {/* Capital */}
      <View style={styles.section}>
        <SectionHeader title="Capital" route="/(bot-wizard)/allocation" />
        <Row
          label="Allocation"
          value={
            allocationUsd
              ? `${Math.round(state.allocationPct * 100)}% — ${allocationUsd}`
              : `${Math.round(state.allocationPct * 100)}%`
          }
        />
      </View>

      {/* Safety */}
      <View style={styles.section}>
        <SectionHeader title="Safety" route="/(bot-wizard)/safety" />
        <Row
          label="Daily Max Loss"
          value={
            lossUsd
              ? `${Math.round(state.dailyMaxLoss * 100)}% — ${lossUsd}`
              : `${Math.round(state.dailyMaxLoss * 100)}%`
          }
        />
        {state.dailyMaxGain !== null && (
          <Row label="Daily Gain Cap" value={formatUsd(state.dailyMaxGain)} />
        )}
        <Row label="Stop-Loss Style" value={state.stopLossStyle?.name ?? "—"} />
        {state.emotionalControls.freezeAfterLosses !== null && (
          <Row
            label="Freeze After Losses"
            value={`${state.emotionalControls.freezeAfterLosses} in a row`}
          />
        )}
        {state.emotionalControls.cooldownAfterVolatility && (
          <Row label="Cooldown After Volatility" value="On" />
        )}
        {state.emotionalControls.standDownAfterNoonIfLosing && (
          <Row label="Stand Down After Noon" value="On" />
        )}
      </View>

      {/* Sector Preferences */}
      <View style={styles.section}>
        <SectionHeader title="Sector Preferences" route="/(bot-wizard)/sectors" />
        <Text style={styles.rowValue}>
          {state.sectors.length > 0 ? state.sectors.join(", ") : "—"}
        </Text>
      </View>

      {/* Identity */}
      <View style={styles.section}>
        <SectionHeader title="Identity" route="/(bot-wizard)/identity" />
        <Row label="Name" value={state.name || "—"} />
        {state.colorway ? (
          <View style={styles.frameRow}>
            <Text style={styles.rowLabel}>Colorway</Text>
            <View style={[styles.colorwayDot, { backgroundColor: state.colorway }]} />
          </View>
        ) : null}
        {state.avatarId ? <Row label="Avatar" value={state.avatarId} /> : null}
      </View>

      {/* Brain */}
      <View style={styles.section}>
        <SectionHeader title="Brain" route="/(bot-wizard)/brain" />
        <Row
          label="Type"
          value={
            state.brain.brainType === BrainType.TachyonHosted
              ? "Tachyon Default"
              : "Bring Your Own Key"
          }
        />
        {state.brain.brainType === BrainType.Byok && (
          <>
            <Row label="Provider" value={state.brain.provider} />
            <Row label="Model" value={state.brain.modelId} />
            <Row
              label="API Key"
              value={
                isKeyValidated
                  ? maskApiKey(state.brain.apiKey)
                  : "Not validated"
              }
            />
          </>
        )}
        {state.brain.brainType === BrainType.TachyonHosted && (
          <Row label="Model" value={state.brain.modelId} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  section: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 10,
    padding: 14,
    gap: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: {
    color: Colors.dark.textPrimary,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  editLink: {
    color: Colors.dark.electricBlue,
    fontSize: 13,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
  },
  rowLabel: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
  },
  rowValue: {
    color: Colors.dark.textPrimary,
    fontSize: 13,
    fontWeight: "500",
    flexShrink: 1,
    textAlign: "right",
  },
  frameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  colorwayDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
