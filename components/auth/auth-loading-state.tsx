import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

interface AuthLoadingStateProps {
  message?: string;
}

export function AuthLoadingState({ message }: AuthLoadingStateProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "dark"];

  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 900 }), -1, true);
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View
        style={[
          styles.logoPlaceholder,
          { backgroundColor: theme.electricBlue },
          pulseStyle,
        ]}
      />
      <ActivityIndicator
        size="small"
        color={theme.electricBlue}
        style={styles.spinner}
      />
      {message ? (
        <Text style={[styles.message, { color: theme.textSecondary }]}>
          {message}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginBottom: 32,
  },
  spinner: {
    marginBottom: 16,
  },
  message: {
    fontSize: 14,
  },
});
