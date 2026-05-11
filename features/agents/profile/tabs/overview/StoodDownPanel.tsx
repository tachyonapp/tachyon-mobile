import { type ThemeColors } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

export const StoodDownPanel = ({ theme }: { theme: ThemeColors }) => {
  return (
    <View style={[styles.section, { backgroundColor: theme.surface }]}>
      <Text style={[styles.stoodDownHeadline, { color: theme.textPrimary }]}>
        Your bot has been stood down
      </Text>
      <Text style={[styles.stoodDownSubtext, { color: theme.textSecondary }]}>
        Reactivates next trading day
      </Text>
      <View
        style={[styles.disabledButton, { backgroundColor: theme.textDisabled }]}
      >
        <Text style={[styles.disabledButtonText, { color: theme.surface }]}>
          Activate — Reactivates next trading day
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  stoodDownHeadline: {
    fontSize: 16,
    fontWeight: "700",
  },
  stoodDownSubtext: {
    fontSize: 13,
  },
  disabledButton: {
    marginTop: 4,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    opacity: 0.5,
  },
  disabledButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
