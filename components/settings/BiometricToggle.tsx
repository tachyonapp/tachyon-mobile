import { useBiometricAuth } from "@/auth/BiometricAuthProvider";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useState } from "react";
import { Platform, StyleSheet, Switch, Text, View } from "react-native";

const BIOMETRIC_LABEL =
  Platform.OS === "ios" ? "Face ID / Touch ID" : "Fingerprint unlock";

export function BiometricToggle() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];
  const { isSupported, isDeviceEnrolled, isEnabled, enable, disable } =
    useBiometricAuth();

  // Tracks when enable() is awaiting the biometric prompt — disables the toggle
  // during that window so the user can't double-tap and fire two prompts.
  const [isPending, setIsPending] = useState(false);

  // Hidden entirely when the device doesn't support biometrics or the user
  // hasn't enrolled — no point exposing a toggle that can never be used.
  if (!isSupported || !isDeviceEnrolled) return null;

  const handleToggle = async (value: boolean) => {
    if (isPending) return;
    setIsPending(true);
    try {
      if (value) {
        await enable();
        // enable() prompts biometrics — if the prompt fails/cancels, isEnabled
        // stays false and the switch reflects that on the next render.
      } else {
        await disable();
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <View style={[styles.row, { borderColor: theme.inputBorder }]}>
      <View style={styles.rowLabel}>
        <Text style={[styles.rowTitle, { color: theme.textPrimary }]}>
          {BIOMETRIC_LABEL}
        </Text>
        <Text style={[styles.rowSubtitle, { color: theme.textSecondary }]}>
          Require biometric authentication when opening Tachyon
        </Text>
      </View>
      <Switch
        value={isEnabled}
        onValueChange={handleToggle}
        disabled={isPending}
        trackColor={{ false: theme.inputBorder, true: theme.electricBlue }}
        thumbColor={theme.textPrimary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  rowLabel: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  rowSubtitle: {
    fontSize: 13,
  },
});
