import { IconSymbol } from "@/components/ui/icon-symbol";
import { FRAME_CONFIG } from "@/constants/frameConfig";
import { Colors } from "@/constants/theme";
import { type WizardState } from "@/context/WizardContext";
import { BrainType } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { botttsNeutral } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import LottieView from "lottie-react-native";
import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { ForgeStatChip } from "./ForgeStatChip";

const POD_ANIMATION = require("@/assets/animations/pod.json");
const LEFT_COL_WIDTH = 60;
const AVATAR_SIZE = 60;
const HEADER_HEIGHT = 48;

interface ForgeStatPanelProps {
  state: WizardState;
  height: number;
  onClose: () => void;
  name: string;
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

export function ForgeStatPanel({
  state,
  height,
  onClose,
  name,
}: ForgeStatPanelProps) {
  const theme = Colors[useColorScheme()];
  const { width: screenWidth } = useWindowDimensions();
  const frameConfig = state.frameName ? FRAME_CONFIG[state.frameName] : null;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const animatedHeight = useRef(new Animated.Value(height)).current;

  function toggleCollapse() {
    const toValue = isCollapsed ? height : HEADER_HEIGHT;
    setIsCollapsed((prev) => !prev);
    Animated.spring(animatedHeight, {
      toValue,
      useNativeDriver: false,
      bounciness: 3,
      speed: 16,
    }).start();
  }

  const avatarSvg = useMemo(
    () => createAvatar(botttsNeutral, { seed: name || "default" }).toString(),
    [name],
  );

  const brainLabel =
    state.brain.brainType === BrainType.TachyonHosted
      ? "Tachyon AI"
      : state.brain.provider
        ? capitalize(state.brain.provider)
        : "BYOK";

  const animAreaWidth = screenWidth - 32 - LEFT_COL_WIDTH - 12;
  const lottieSize = Math.min(animAreaWidth, height - 240);

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
    <Animated.View
      style={[
        styles.panel,
        {
          height: animatedHeight,
          backgroundColor: theme.background,
          borderBottomColor: theme.inputBorder,
        },
      ]}
    >
      {/* ── Compact header — always visible ── */}
      <View style={[styles.header, { borderBottomColor: theme.inputBorder }]}>
        <Pressable
          onPress={onClose}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Close bot builder"
          style={styles.headerBtn}
        >
          <Text style={[styles.closeBtnText, { color: theme.textSecondary }]}>
            ✕
          </Text>
        </Pressable>

        <Text
          style={[styles.headerTitle, { color: theme.textSecondary }]}
          numberOfLines={1}
        >
          {name.trim() || "Bot Forge"}
        </Text>

        <Pressable
          onPress={toggleCollapse}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={
            isCollapsed ? "Expand stats panel" : "Collapse stats panel"
          }
          style={styles.headerBtn}
        >
          <IconSymbol
            name={isCollapsed ? "chevron.down" : "chevron.up"}
            size={16}
            color={theme.textSecondary}
          />
        </Pressable>
      </View>

      {/* ── Scrollable content — clipped when collapsed via overflow: hidden ── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top area: animation left, market awareness chips + avatar right */}
        <View style={styles.topArea}>
          <View style={styles.animationArea}>
            <LottieView
              source={POD_ANIMATION}
              autoPlay
              loop
              style={{ width: lottieSize, height: lottieSize }}
            />
          </View>
          <View style={styles.leftChipsCol}>
            <View style={styles.chipsRow}>
              <View
                style={[
                  styles.previewAvatar,
                  { backgroundColor: theme.background },
                ]}
              >
                <SvgXml
                  xml={avatarSvg}
                  width={AVATAR_SIZE}
                  height={AVATAR_SIZE}
                />
              </View>
            </View>
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
        </View>

        {/* Stat chip rows */}
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  panel: {
    borderBottomWidth: 5,
    overflow: "hidden",
  },
  header: {
    height: HEADER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBtn: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
  closeBtnText: {
    fontSize: 16,
  },
  previewAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 8,
    overflow: "hidden",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    gap: 12,
    padding: 16,
    paddingBottom: 12,
  },
  topArea: {
    flexDirection: "row",
    gap: 12,
    minHeight: 120,
  },
  animationArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  leftChipsCol: {
    width: LEFT_COL_WIDTH,
    gap: 6,
  },
  chipsGrid: {
    gap: 6,
  },
  chipsRow: {
    flexDirection: "row",
    gap: 8,
  },
});
