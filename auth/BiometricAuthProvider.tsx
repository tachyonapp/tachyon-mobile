import { useAuth } from "@/auth/AuthProvider";
import * as LocalAuthentication from "expo-local-authentication";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState } from "react-native";

const BIOMETRIC_ENABLED_KEY = "tachyon.biometric_enabled";
const LOCK_GRACE_PERIOD_MS = 3000;

interface BiometricAuthState {
  isSupported: boolean;
  isEnrolled: boolean;
  isEnabled: boolean;
  isLocked: boolean;
  isPrompting: boolean;
  enable: () => Promise<void>;
  disable: () => Promise<void>;
  prompt: () => Promise<boolean>;
  lock: () => void;
}

const BiometricAuthContext = createContext<BiometricAuthState | null>(null);

export function BiometricAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isPrompting, setIsPrompting] = useState(false);

  // Refs give the AppState callback fresh values without re-registering the listener
  const isEnabledRef = useRef(isEnabled);
  const isAuthenticatedRef = useRef(isAuthenticated);
  const backgroundedAtRef = useRef<number | null>(null);

  useEffect(() => {
    isEnabledRef.current = isEnabled;
  }, [isEnabled]);

  useEffect(() => {
    isAuthenticatedRef.current = isAuthenticated;
  }, [isAuthenticated]);

  // On mount: check hardware/enrollment and read persisted preference
  useEffect(() => {
    let cancelled = false;

    async function init() {
      const [supported, enrolled] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
      ]);

      if (cancelled) return;
      setIsSupported(supported);
      setIsEnrolled(enrolled);

      if (!supported || !enrolled) return;

      const stored = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
      if (cancelled) return;

      if (stored === "true") {
        setIsEnabled(true);
        // Lock immediately on cold start. This runs before Clerk resolves
        // isAuthenticated, so the splash screen remains visible (RootNavigator
        // gates SplashScreen.hideAsync on !isLocked) — no app content flashes through.
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

  // Lock the app when it returns to the foreground after being backgrounded
  // beyond the grace period, but only when biometrics are enabled and the
  // user is authenticated. Brief switches (e.g. copy-pasting an OTP from SMS)
  // fall within the grace period and do not trigger a lock.
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "background") {
        backgroundedAtRef.current = Date.now();
      } else if (nextState === "active") {
        if (
          backgroundedAtRef.current !== null &&
          isEnabledRef.current &&
          isAuthenticatedRef.current
        ) {
          const elapsed = Date.now() - backgroundedAtRef.current;
          if (elapsed >= LOCK_GRACE_PERIOD_MS) {
            setIsLocked(true);
          }
        }
        // Reset regardless — avoids a stale timestamp on the next background cycle
        backgroundedAtRef.current = null;
      }
    });

    return () => subscription.remove();
  }, []); // empty deps — refs provide fresh values without re-registration

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

  return (
    <BiometricAuthContext.Provider
      value={{
        isSupported,
        isEnrolled,
        isEnabled,
        isLocked,
        isPrompting,
        enable,
        disable,
        prompt,
        lock,
      }}
    >
      {children}
    </BiometricAuthContext.Provider>
  );
}

export function useBiometricAuth(): BiometricAuthState {
  const ctx = useContext(BiometricAuthContext);
  if (!ctx)
    throw new Error("useBiometricAuth must be used within BiometricAuthProvider");
  return ctx;
}
