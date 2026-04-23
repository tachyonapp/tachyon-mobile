import { FRAME_CONFIG } from "@/constants/frameConfig";
import { Colors } from "@/constants/theme";
import { type WizardState } from "@/context/WizardContext";
import { BrainType } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import LottieView from "lottie-react-native";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { ForgeStatChip } from "./ForgeStatChip";

const POD_ANIMATION = require("@/assets/animations/pod.json");

const LEFT_COL_WIDTH = 55;

interface ForgeStatPanelProps {
  state: WizardState;
  height: number;
  onClose: () => void;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

export function ForgeStatPanel({
  state,
  height,
  onClose,
}: ForgeStatPanelProps) {
  const theme = Colors[useColorScheme()];
  const { width: screenWidth } = useWindowDimensions();
  const frameConfig = state.frameName ? FRAME_CONFIG[state.frameName] : null;

  const brainLabel =
    state.brain.brainType === BrainType.TachyonHosted
      ? "Tachyon AI"
      : state.brain.provider
        ? capitalize(state.brain.provider)
        : "BYOK";

  // Animation sits in the space to the right of the left column.
  // Cap by both available width and a height budget so it stays compact.
  const animAreaWidth = screenWidth - 32 - LEFT_COL_WIDTH - 12;
  const lottieSize = Math.min(animAreaWidth, height - 240);

  return (
    <View
      style={[
        styles.panel,
        {
          height,
          backgroundColor: theme.background,
          borderBottomColor: frameConfig?.colorway ?? theme.inputBorder,
        },
      ]}
    >
      {/* Close button */}
      <Pressable
        style={styles.closeBtn}
        onPress={onClose}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Close bot builder"
      >
        <Text style={[styles.closeBtnText, { color: theme.textSecondary }]}>
          ✕
        </Text>
      </Pressable>

      {/* Top area: market awareness chips left, animation right */}
      <View style={styles.topArea}>
        <View style={styles.leftChipsCol}>
          <ForgeStatChip
            label="MOM"
            value={`${Math.round(state.marketAwareness.momentum * 100)}%`}
          />
          <ForgeStatChip
            label="M/R"
            value={`${Math.round(state.marketAwareness.meanReversion * 100)}%`}
          />
          <ForgeStatChip
            label="VOL"
            value={`${Math.round(state.marketAwareness.volatility * 100)}%`}
          />
          <ForgeStatChip
            label="TRND"
            value={`${Math.round(state.marketAwareness.trendFollowing * 100)}%`}
          />
        </View>

        <View style={styles.animationArea}>
          <LottieView
            source={POD_ANIMATION}
            autoPlay
            loop
            style={{ width: lottieSize, height: lottieSize }}
          />
        </View>
      </View>

      {/* Bottom stat cards — 2 rows of 3 */}
      <View style={styles.chipsGrid}>
        <View style={styles.chipsRow}>
          <ForgeStatChip label="NAME" value={state.name.trim() || null} />
          <ForgeStatChip
            label="FRAME"
            value={frameConfig?.gamifiedName ?? null}
            colorway={frameConfig?.colorway ?? null}
          />
          <ForgeStatChip label="BRAIN" value={brainLabel} />
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderBottomWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  closeBtn: {
    position: "absolute",
    top: 12,
    right: 16,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  closeBtnText: {
    fontSize: 16,
  },
  topArea: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
  },
  leftChipsCol: {
    width: LEFT_COL_WIDTH,
    gap: 6,
    marginBottom: 10,
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
