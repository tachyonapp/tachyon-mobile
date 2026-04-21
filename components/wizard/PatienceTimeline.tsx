import { Colors } from "@/constants/theme";
import { CombatPatience } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useCallback, useRef } from "react";
import { Animated, LayoutChangeEvent, StyleSheet, Text, View } from "react-native";

const PATIENCE_OPTIONS = [
  CombatPatience.Impulsive,
  CombatPatience.Calculated,
  CombatPatience.Patient,
  CombatPatience.Strategic,
];

const LABELS = ["Impulsive", "Calculated", "Patient", "Strategic"];
const NODE_SIZE = 10;
const DOT_SIZE = 18;

interface AnimatedPatienceTimelineProps {
  selectedIndex: number;
  bounds: CombatPatience[];
}

export function AnimatedPatienceTimeline({
  selectedIndex,
  bounds,
}: AnimatedPatienceTimelineProps) {
  const theme = Colors[useColorScheme()];

  const trackWidth = useRef(0);
  const dotX = useRef(new Animated.Value(0)).current;
  const dotOpacity = useRef(new Animated.Value(0)).current;
  const hasSelected = useRef(false);

  const getNodeX = useCallback(
    (index: number, width: number) =>
      (index / (PATIENCE_OPTIONS.length - 1)) * (width - DOT_SIZE),
    [],
  );

  const animateDot = useCallback(
    (index: number) => {
      if (trackWidth.current === 0) return;
      const toX = getNodeX(index, trackWidth.current);

      if (!hasSelected.current) {
        hasSelected.current = true;
        dotX.setValue(toX);
        Animated.timing(dotOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.spring(dotX, {
          toValue: toX,
          useNativeDriver: true,
          tension: 70,
          friction: 11,
        }).start();
      }
    },
    [dotX, dotOpacity, getNodeX],
  );

  const onTrackLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const width = e.nativeEvent.layout.width;
      trackWidth.current = width;
      if (selectedIndex >= 0) {
        animateDot(selectedIndex);
      }
    },
    [selectedIndex, animateDot],
  );

  // Trigger animation when selectedIndex changes
  React.useEffect(() => {
    if (selectedIndex >= 0) {
      animateDot(selectedIndex);
    }
  }, [selectedIndex, animateDot]);

  return (
    <View style={styles.wrapper}>
      <View style={styles.trackContainer} onLayout={onTrackLayout}>
        {/* Static track line */}
        <View
          style={[styles.trackLine, { backgroundColor: theme.inputBorder }]}
        />

        {/* Static nodes */}
        <View style={styles.nodesRow}>
          {PATIENCE_OPTIONS.map((opt, i) => (
            <View
              key={opt}
              style={[
                styles.node,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.inputBorder,
                  opacity: !bounds.includes(opt) ? 0.3 : 1,
                },
                i === 0 && { marginLeft: DOT_SIZE / 2 - NODE_SIZE / 2 },
                i === PATIENCE_OPTIONS.length - 1 && {
                  marginRight: DOT_SIZE / 2 - NODE_SIZE / 2,
                },
              ]}
            />
          ))}
        </View>

        {/* Animated dot */}
        <Animated.View
          style={[
            styles.dot,
            {
              backgroundColor: theme.electricBlue,
              opacity: dotOpacity,
              transform: [{ translateX: dotX }],
            },
          ]}
        />
      </View>

      <View style={styles.labelsRow}>
        {LABELS.map((label, i) => (
          <Text
            key={label}
            style={[
              styles.label,
              {
                color:
                  i === selectedIndex
                    ? theme.electricBlue
                    : theme.textSecondary,
                fontWeight: i === selectedIndex ? "600" : "400",
                opacity: !bounds.includes(PATIENCE_OPTIONS[i]) ? 0.3 : 1,
              },
            ]}
          >
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    gap: 10,
    paddingVertical: 16,
  },
  trackContainer: {
    height: DOT_SIZE,
    justifyContent: "center",
  },
  trackLine: {
    position: "absolute",
    left: DOT_SIZE / 2,
    right: DOT_SIZE / 2,
    height: 2,
    borderRadius: 1,
  },
  nodesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: DOT_SIZE / 2 - NODE_SIZE / 2,
  },
  node: {
    width: NODE_SIZE,
    height: NODE_SIZE,
    borderRadius: NODE_SIZE / 2,
    borderWidth: 2,
  },
  dot: {
    position: "absolute",
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    flex: 1,
    fontSize: 11,
    textAlign: "center",
  },
});
