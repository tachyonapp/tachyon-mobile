import { RiskAttitude } from "@/generated/graphql";
import React from "react";
import { StyleSheet, View } from "react-native";

const RISK_COLORS: Record<RiskAttitude, string> = {
  [RiskAttitude.Cautious]: "green",
  [RiskAttitude.Balanced]: "yellow",
  [RiskAttitude.Aggressive]: "red",
};

// Ring is 208px tall, centered in a 200px animationWrapper.
// Ring center Y = (200 - 208) / 2 + 104 = 100.
// Ring bottom Y = 100 + 104 = 204.
const RING_BOTTOM_Y = 204;

interface RiskShapeProps {
  riskAttitude: RiskAttitude;
  size?: number;
}

export function RiskShape({ riskAttitude, size = 14 }: RiskShapeProps) {
  const color = RISK_COLORS[riskAttitude];

  if (riskAttitude === RiskAttitude.Cautious) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
        }}
      />
    );
  }

  if (riskAttitude === RiskAttitude.Balanced) {
    return (
      <View
        style={{
          width: size - 2,
          height: size - 2,
          borderRadius: 3,
          backgroundColor: color,
        }}
      />
    );
  }

  // Aggressive: upward triangle
  const tw = size;
  const th = Math.round(size * 0.875);
  return (
    <View
      style={{
        width: tw,
        height: th,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderLeftWidth: tw / 2,
          borderRightWidth: tw / 2,
          borderBottomWidth: th,
          borderLeftColor: "transparent",
          borderRightColor: "transparent",
          borderBottomColor: color,
        }}
      />
    </View>
  );
}

interface RiskShapeIndicatorProps {
  riskAttitude: RiskAttitude;
}

export function RiskShapeIndicator({ riskAttitude }: RiskShapeIndicatorProps) {
  const SHAPE_SIZE = 16;
  const top = RING_BOTTOM_Y - SHAPE_SIZE / 2;

  return (
    <View pointerEvents="none" style={[styles.wrapper, { top }]}>
      <RiskShape riskAttitude={riskAttitude} size={SHAPE_SIZE} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    alignSelf: "center",
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});
