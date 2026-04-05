import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const easeOutQuad = (t: number): number => {
  "worklet";
  return 1 - (1 - t) * (1 - t);
};

const easeInOutSine = (t: number): number => {
  "worklet";
  return -(Math.cos(Math.PI * t) - 1) / 2;
};

/**
 * Slide 3 — You Approve Every Trade (COMPLIANCE CRITICAL)
 *
 * Animation concept: A floating trade proposal card gently bobs up and down.
 * Two action buttons — Approve (green ✓) and Skip (grey ✗) — sit below the card.
 * The Approve button pulses its scale softly to draw attention to the user's choice.
 * No robot. The visual centerpiece is the user's decision, not an autonomous agent.
 * Style: dark background (#0B0F1A), approve green (#1C9C61), skip grey (#5A6275)
 * Implementation: react-native-reanimated, pure View/Text primitives. No Lottie.
 */

import { Text } from "react-native";

const CARD_W = 200;
const CARD_H = 100;

function TradeCard() {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Fade in on mount
    opacity.value = withTiming(1, { duration: 400, easing: easeOutQuad });

    // Continuous gentle bob
    translateY.value = withDelay(
      400,
      withRepeat(
        withSequence(
          withTiming(-8, { duration: 1200, easing: easeInOutSine }),
          withTiming(0, { duration: 1200, easing: easeInOutSine })
        ),
        -1,
        false
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.card, animStyle]}>
      {/* Header label */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderDot} />
        <Text style={styles.cardHeaderText}>TRADE PROPOSAL</Text>
      </View>

      {/* Ticker row */}
      <View style={styles.cardBody}>
        <Text style={styles.tickerText}>AAPL</Text>
        <View style={styles.pillBuy}>
          <Text style={styles.pillText}>BUY</Text>
        </View>
      </View>

      {/* Amount row */}
      <View style={styles.cardMeta}>
        <Text style={styles.metaLabel}>10 shares  ·  ~$1,820</Text>
      </View>
    </Animated.View>
  );
}

function ApproveButton() {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withDelay(
      900,
      withRepeat(
        withSequence(
          withTiming(1.08, { duration: 700, easing: easeInOutSine }),
          withTiming(1.0, { duration: 700, easing: easeInOutSine })
        ),
        -1,
        false
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.btnApprove, animStyle]}>
      <Text style={styles.btnApproveText}>✓</Text>
    </Animated.View>
  );
}

function SkipButton() {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(600, withTiming(1, { duration: 400 }));
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View style={[styles.btnSkip, animStyle]}>
      <Text style={styles.btnSkipText}>✕</Text>
    </Animated.View>
  );
}

export function SlideIllustration3() {
  return (
    <View style={styles.container}>
      <TradeCard />

      <View style={styles.buttonRow}>
        <SkipButton />
        <ApproveButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 260,
    height: 260,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },

  // Card
  card: {
    width: CARD_W,
    height: CARD_H,
    backgroundColor: "#151B2E",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#2C6BED44",
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "space-between",
    shadowColor: "#2C6BED",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardHeaderDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2C6BED",
  },
  cardHeaderText: {
    color: "#2C6BED",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  cardBody: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  tickerText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  pillBuy: {
    backgroundColor: "#1C9C6122",
    borderWidth: 1,
    borderColor: "#1C9C61",
    borderRadius: 4,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  pillText: {
    color: "#1C9C61",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  cardMeta: {
    marginTop: 2,
  },
  metaLabel: {
    color: "#8A90A2",
    fontSize: 11,
  },

  // Buttons
  buttonRow: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  btnApprove: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#1C9C61",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1C9C61",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  btnApproveText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "700",
  },
  btnSkip: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#5A6275",
    alignItems: "center",
    justifyContent: "center",
  },
  btnSkipText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
