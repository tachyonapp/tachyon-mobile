import { type ThemeColors } from "@/constants/theme";
import { StyleSheet, View } from "react-native";

interface ScanCapBarProps {
  used: number;
  cap: number;
  theme: ThemeColors;
}

export const ScanCapBar = ({ used, cap, theme }: ScanCapBarProps) => {
  const pct = cap > 0 ? Math.min(used / cap, 1) : 0;
  return (
    <View style={[styles.capBarTrack, { backgroundColor: theme.inputBorder }]}>
      <View
        style={[
          styles.capBarFill,
          {
            width: `${pct * 100}%`,
            backgroundColor: pct >= 0.9 ? theme.danger : theme.electricBlue,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  capBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 2,
    marginBottom: 4,
  },
  capBarFill: {
    height: "100%",
    borderRadius: 3,
  },
});
