import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface WizardNavBarProps {
  onBack?: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  loading?: boolean;
}

export function WizardNavBar({
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel = "Next",
  loading = false,
}: WizardNavBarProps) {
  const theme = Colors[useColorScheme()];

  return (
    <View
      style={[styles.container, { borderTopColor: theme.inputBorder }]}
    >
      {onBack ? (
        <Pressable
          onPress={onBack}
          style={styles.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text style={[styles.backText, { color: theme.textSecondary }]}>
            Back
          </Text>
        </Pressable>
      ) : (
        <View style={styles.backBtn} />
      )}

      {onNext ? (
        <Pressable
          onPress={onNext}
          disabled={nextDisabled || loading}
          style={[
            styles.nextBtn,
            {
              backgroundColor:
                nextDisabled || loading
                  ? theme.inputBorder
                  : theme.electricBlue,
            },
          ]}
          accessibilityRole="button"
          accessibilityLabel={nextLabel}
        >
          {loading ? (
            <ActivityIndicator size="small" color={theme.textPrimary} />
          ) : (
            <Text
              style={[
                styles.nextText,
                {
                  color: nextDisabled ? theme.textDisabled : theme.textPrimary,
                },
              ]}
            >
              {nextLabel}
            </Text>
          )}
        </Pressable>
      ) : (
        <View style={styles.nextBtn} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  backBtn: {
    minWidth: 64,
    height: 44,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  backText: {
    fontSize: 15,
    fontWeight: "500",
  },
  nextBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  nextText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
