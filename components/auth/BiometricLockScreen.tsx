import TachyonLogo from "@/assets/images/logo.png";
import { Colors } from "@/constants/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface BiometricLockScreenProps {
  onPrompt: () => Promise<boolean>;
  onFallback: () => void;
}

// Always rendered over authenticated content — lock to dark theme regardless
// of the user's system setting, so the overlay is never transparent or jarring.
const theme = Colors.dark;

const ICON_NAME = Platform.OS === "ios" ? "face-recognition" : "fingerprint";
const PROMPT_LABEL =
  Platform.OS === "ios"
    ? "Tap to unlock with Face ID"
    : "Tap to unlock with fingerprint";

export function BiometricLockScreen({
  onPrompt,
  onFallback,
}: BiometricLockScreenProps) {
  const [isPrompting, setIsPrompting] = useState(false);

  const handlePrompt = useCallback(async () => {
    if (isPrompting) return;
    setIsPrompting(true);
    try {
      await onPrompt();
      // On success, useBiometricAuth sets isLocked=false — parent unmounts this overlay.
      // On failure/cancel, isLocked remains true so we stay visible.
    } finally {
      setIsPrompting(false);
    }
  }, [isPrompting, onPrompt]);

  return (
    // Outer Pressable covers the full screen so tapping anywhere triggers the prompt
    <Pressable style={styles.container} onPress={handlePrompt}>
      <Image source={TachyonLogo} style={styles.logo} resizeMode="contain" />

      <View style={styles.iconContainer}>
        {isPrompting ? (
          <ActivityIndicator
            size="large"
            color={theme.electricBlue}
            style={styles.spinner}
          />
        ) : (
          <MaterialCommunityIcons
            name={ICON_NAME}
            size={64}
            color={theme.electricBlue}
          />
        )}
      </View>

      <Text style={styles.promptLabel}>{PROMPT_LABEL}</Text>

      {/* Pressable stops propagation so tapping fallback doesn't also fire handlePrompt */}
      <Pressable
        onPress={(e) => {
          e.stopPropagation();
          onFallback();
        }}
        style={styles.fallbackButton}
        hitSlop={12}
      >
        <Text style={styles.fallbackLabel}>Use Email &amp; Password</Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    // Absolute fill — rendered above all app content, no transparency
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.background,
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 16,
  },
  iconContainer: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  spinner: {
    // matches icon bounding box so layout doesn't shift during prompt
  },
  promptLabel: {
    color: theme.textSecondary,
    fontSize: 16,
    fontWeight: "500",
  },
  fallbackButton: {
    marginTop: 8,
  },
  fallbackLabel: {
    color: theme.electricBlue,
    fontSize: 14,
    fontWeight: "500",
  },
});
