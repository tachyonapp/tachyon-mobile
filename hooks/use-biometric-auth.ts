import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

const BIOMETRIC_ENABLED_KEY = "tachyon.biometric_enabled";

interface BiometricAuthState {
  isSupported: boolean; // device has Face ID / Touch ID hardware
  isEnrolled: boolean; // user has enrolled biometrics on device
  isEnabled: boolean; // user has turned on biometrics in Tachyon settings
  isLocked: boolean; // app is currently gated — prompt required
  isPrompting: boolean; // biometric prompt is currently showing
  enable: () => Promise<void>; // prompt once then persist enabled=true
  disable: () => Promise<void>; // persist enabled=false, set isLocked=false
  prompt: () => Promise<boolean>; // trigger biometric prompt, returns success
  lock: () => void; // set isLocked=true (called on app background)
}

export function useBiometricAuth(): BiometricAuthState {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isPrompting, setIsPrompting] = useState(false);

  // On mount: check hardware/enrollment and read persisted preference
  useEffect(() => {
    let cancelled = false;

    // enrollment/hardware support check
    async function init() {
      const [supported, enrolled] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
      ]);

      if (cancelled) return;
      setIsSupported(supported);
      setIsEnrolled(enrolled);

      // If the device can't support biometrics, nothing else to do
      if (!supported || !enrolled) return;

      const stored = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
      if (cancelled) return;

      if (stored === "true") {
        setIsEnabled(true);
        // Lock immediately on cold start. This runs before Clerk resolves
        // isAuthenticated, so the splash screen remains visible (Task 4 gates
        // SplashScreen.hideAsync on !isLocked) — no app content flashes through.
        setIsLocked(true);
      }
    }

    init().catch(() => {
      // init failure is non-fatal — biometrics won't engage but the user
      // can still access the app normally via Clerk session.
    });

    return () => {
      cancelled = true;
    };
  }, []);

  const prompt = async (): Promise<boolean> => {
    setIsPrompting(true);
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Unlock Tachyon",
        // fallbackLabel: "" hides the "Enter Password" button in the iOS prompt UI.
        // disableDeviceFallback: true enforces the restriction at the API level on
        // both iOS and Android. Together they ensure failed biometrics always route
        // to Clerk re-login rather than falling through to the device PIN/passcode.
        fallbackLabel: "",
        disableDeviceFallback: true,
      });

      if (result.success) {
        setIsLocked(false);
        return true;
      }

      // Cancelled or failed — isLocked intentionally remains true. The user must
      // retry or take the fallback path (Clerk re-login) to regain access.
      return false;
    } finally {
      setIsPrompting(false);
    }
  };

  const enable = async (): Promise<void> => {
    // Require a successful biometric prompt before persisting the preference.
    // This prevents enabling biometrics on a device where the prompt would
    // immediately fail (e.g. hardware present but sensors obscured).
    // prompt() sets isLocked=false on success — when called from the settings
    // screen the user isn't locked, so that's a no-op here.
    const success = await prompt();
    if (success) {
      await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, "true");
      setIsEnabled(true);
    }
  };

  const disable = async (): Promise<void> => {
    await SecureStore.deleteItemAsync(BIOMETRIC_ENABLED_KEY);
    setIsEnabled(false);
    setIsLocked(false);
  };

  const lock = (): void => {
    setIsLocked(true);
  };

  return {
    isSupported,
    isEnrolled,
    isEnabled,
    isLocked,
    isPrompting,
    enable,
    disable,
    prompt,
    lock,
  };
}
