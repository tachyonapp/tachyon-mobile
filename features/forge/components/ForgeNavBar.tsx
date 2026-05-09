import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface ForgeNavBarProps {
  onBack?: () => void;
  onNext?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  loading?: boolean;
}

export function ForgeNavBar({
  onBack,
  onNext,
  nextDisabled = false,
  nextLabel = "Next",
  loading = false,
}: ForgeNavBarProps) {
  const theme = Colors[useColorScheme()];

  return (
    <View style={[styles.container, { borderTopColor: theme.inputBorder }]}>
      {onBack ? (
        <Pressable
          onPress={onBack}
          style={[styles.backBtn, { backgroundColor: theme.electricBlue }]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Text
            style={[
              styles.backText,
              {
                color: theme.textPrimary,
              },
            ]}
          >
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
    paddingVertical: 15,
    borderTopWidth: 1,
    gap: 12,
  },
  backBtn: {
    minWidth: 64,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  backText: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
  },
  nextBtn: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 64,
    maxWidth: 120,
  },
  nextText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
