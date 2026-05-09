import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { StyleSheet, View } from "react-native";

interface ForgeProgressBarProps {
  currentStep: number; // 1-based: currentStep=2 means step 2 is active (segments 1 filled, 1 active)
  totalSteps: number;
}

export function ForgeProgressBar({
  currentStep,
  totalSteps,
}: ForgeProgressBarProps) {
  const theme = Colors[useColorScheme()];

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, i) => {
        const filled = i < currentStep;
        return (
          <View
            key={i}
            style={[
              styles.segment,
              {
                backgroundColor: filled
                  ? theme.electricBlue
                  : theme.inputBorder,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  segment: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
});
