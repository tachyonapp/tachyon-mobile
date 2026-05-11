import { AgentAvatar } from "@/components/shared/AgentAvatar";
import { FRAME_CONFIG } from "@/constants/frameConfig";
import { Colors } from "@/constants/theme";
import { type WizardState } from "@/context/WizardContext";
import { BrainType } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import LottieView from "lottie-react-native";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ForgeStatChip } from "./ForgeStatChip";

const POD_ANIMATION = require("@/assets/animations/pod.json");
interface ForgeStatPanelProps {
  state: WizardState;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function formatEnumLabel(s: string): string {
  return s
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

export function ForgeStatPanel({ state }: ForgeStatPanelProps) {
  const theme = Colors[useColorScheme()];
  const frameConfig = state.frameName ? FRAME_CONFIG[state.frameName] : null;

  const brainLabel =
    state.brain.brainType === BrainType.TachyonHosted
      ? "Tachyon AI"
      : state.brain.provider
        ? capitalize(state.brain.provider)
        : "BYOK";

  const exitLabel = state.exitPersonality?.name
    ? formatEnumLabel(state.exitPersonality.name)
    : null;

  const stopLabel = state.stopLossStyle?.name
    ? formatEnumLabel(state.stopLossStyle.name)
    : null;

  const sectorsLabel =
    state.sectors.length > 0 ? String(state.sectors.length) : null;

  const maxLossLabel = `${Math.round(state.dailyMaxLoss * 100)}%`;

  const maxGainLabel =
    state.dailyMaxGain !== null
      ? `${Math.round(state.dailyMaxGain * 100)}%`
      : null;

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.topArea}>
        <View style={styles.animationArea}>
          <LottieView
            source={POD_ANIMATION}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
        </View>
      </View>

      {/* Stat chip rows */}
      <View style={styles.chipsGrid}>
        <View style={styles.chipsRow}>
          <AgentAvatar
            seed={state.avatarSeed}
            backgroundColor={theme.background}
          />
        </View>
        <View style={styles.chipsRow}>
          <ForgeStatChip label="NAME" value={state.name.trim() || null} />
          <ForgeStatChip
            label="FRAME"
            value={frameConfig?.gamifiedName ?? null}
            colorway={frameConfig?.colorway ?? null}
          />
        </View>
        <View style={styles.chipsRow}>
          <ForgeStatChip label="BRAIN" value={brainLabel} />
          <ForgeStatChip
            label="MOM"
            value={`${Math.round(state.marketAwareness.momentum * 100)}%`}
          />
          <ForgeStatChip
            label="M/R"
            value={`${Math.round(state.marketAwareness.meanReversion * 100)}%`}
          />
        </View>

        <View style={styles.chipsRow}>
          <ForgeStatChip
            label="VOL"
            value={`${Math.round(state.marketAwareness.volatility * 100)}%`}
          />
          <ForgeStatChip
            label="TRND"
            value={`${Math.round(state.marketAwareness.trendFollowing * 100)}%`}
          />
        </View>
        <View style={styles.chipsRow}>
          <ForgeStatChip
            label="RISK"
            value={state.riskAttitude ? capitalize(state.riskAttitude) : null}
          />
          <ForgeStatChip
            label="TEMPO"
            value={state.tradeTempo ? capitalize(state.tradeTempo) : null}
          />
          <ForgeStatChip
            label="ALLOC"
            value={`${Math.round(state.allocationPct * 100)}%`}
          />
        </View>
        <View style={styles.chipsRow}>
          <ForgeStatChip
            label="PATIENCE"
            value={
              state.combatPatience ? capitalize(state.combatPatience) : null
            }
          />
          <ForgeStatChip label="EXIT" value={exitLabel} />
          <ForgeStatChip label="STOP" value={stopLabel} />
        </View>
        <View style={styles.chipsRow}>
          <ForgeStatChip label="SECTORS" value={sectorsLabel} />
          <ForgeStatChip label="MAX LOSS" value={maxLossLabel} />
          <ForgeStatChip label="MAX GAIN" value={maxGainLabel} />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderBottomWidth: 5,
    overflow: "hidden",
    gap: 5,
  },
  closeBtnText: {
    fontSize: 16,
  },
  scrollContent: {
    gap: 12,
    paddingBottom: 12,
  },
  topArea: {
    gap: 12,
  },
  animationArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  chipsGrid: {
    gap: 6,
  },
  chipsRow: {
    flexDirection: "row",
    gap: 8,
  },
});
