import { StyleSheet, Text, View } from "react-native";

interface DailyCapProgressBarProps {
  scanCapUsed: number;
  scanCapRemaining: number;
}

export function DailyCapProgressBar({
  scanCapUsed,
  scanCapRemaining,
}: DailyCapProgressBarProps) {
  const total = scanCapUsed + scanCapRemaining;
  const pct = total > 0 ? Math.min(scanCapUsed / total, 1) : 0;

  let fillColor: string;
  if (pct > 0.95) {
    fillColor = "#D64545";
  } else if (pct > 0.8) {
    fillColor = "#F2B705";
  } else {
    fillColor = "#1C9C61";
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>
        Daily scans: {scanCapUsed} / {total}
      </Text>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${pct * 100}%` as `${number}%`, backgroundColor: fillColor },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 6,
    marginVertical: 4,
  },
  label: {
    fontSize: 12,
    color: "#A0A7B8",
  },
  track: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(160,167,184,0.25)",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 2,
  },
});
