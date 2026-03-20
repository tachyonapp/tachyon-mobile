import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface AuthScreenProps {
  children: React.ReactNode;
}

export function AuthScreen({ children }: AuthScreenProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "dark"];

  const opacity = useSharedValue(0.3);

  useEffect(() => {
    // Subtle breathing animation for signal wave
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1800 }),
        withTiming(0.3, { duration: 1800 }),
      ),
      -1, // infinite
      false,
    );
  }, []);

  const signalStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Logo area */}
      <View style={styles.logoContainer}>
        {/*
              TODO: Replace with actual Tachyon logo asset once available.
              For now, render a placeholder View with the brand color.
              Import the logo: import TachyonLogo from '@/assets/images/logo.png';
              Render: <Image source={TachyonLogo} style={styles.logo} resizeMode="contain" />
            */}
        <View
          style={[
            styles.logoPlaceholder,
            { backgroundColor: theme.electricBlue },
          ]}
        />
      </View>

      {/* Animated signal wave */}
      <Animated.View
        style={[
          styles.signalWave,
          { backgroundColor: theme.electricBlue },
          signalStyle,
        ]}
      />

      {/* Keyboard-aware scroll content */}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  logoContainer: {
    alignItems: "center",
    paddingTop: 72,
    paddingBottom: 24,
  },
  logoPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 16,
  },
  signalWave: {
    height: 2,
    marginHorizontal: 40,
    borderRadius: 1,
    marginBottom: 32,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
});
