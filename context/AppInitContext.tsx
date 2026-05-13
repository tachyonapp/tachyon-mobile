import { useAuth } from "@/auth/AuthProvider";
import { useOnboardingState } from "@/hooks/use-onboarding-state";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

interface AppInitContextValue {
  isReady: boolean;
}

const AppInitContext = createContext<AppInitContextValue>({ isReady: false });
// Module-level sentinel used to survive provider remounts.
// Without this, a remount resets local state to `false` and can re-run startup
// redirects, causing visible route flashes and loading-loop behavior.
let appInitCompleted = false;

/**
 * Owns all app initialization logic: auth resolution, onboarding state,
 * pending verification restoration, initial route selection, and splash
 * screen dismissal.
 *
 * Exposes a single `isReady` flag. The root layout gates the Stack on this
 * value — when false, the branded loading screen is shown; when true, the
 * navigator renders with the correct initial route already committed.
 *
 * Must be mounted inside AuthProvider and ApolloProvider.
 */
export function AppInitProvider({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated, pendingVerification } = useAuth();
  const { isComplete } = useOnboardingState();
  const router = useRouter();
  const [isReady, setIsReady] = useState(appInitCompleted);
  // Mirrors the module sentinel inside the effect lifecycle.
  // Prevents multiple `router.replace` calls when dependencies re-evaluate
  // during the same mounted lifetime.
  const initRef = useRef(appInitCompleted);

  useEffect(() => {
    // isLoading includes Clerk readiness + SecureStore verification restore.
    // `isComplete === null` means onboarding SecureStore hydration is pending.
    // Routing before both resolve risks transient redirects to wrong trees.
    if (isLoading || isComplete === null) return;
    if (initRef.current) return;
    initRef.current = true;

    // Startup route decision tree (single owner for initial navigation):
    // 1) signed out + pending verification -> /(auth)/verify
    // 2) signed out + no pending verification -> /(auth)/login
    // 3) signed in + onboarding incomplete -> /(onboarding)
    // 4) signed in + onboarding complete -> /(tabs)
    // We intentionally do not rely on nav state restoration here because it can
    // revive transient flows (e.g. agent-forge) after app relaunch.
    if (!isAuthenticated && pendingVerification) {
      // Verification was in progress when the app was last closed — return
      // the user directly to the verify screen so they can complete it.
      router.replace("/(auth)/verify");
    } else if (!isAuthenticated) {
      router.replace("/(auth)/login");
    } else if (!isComplete) {
      router.replace("/(onboarding)");
    } else {
      router.replace("/(tabs)");
    }

    // Persist readiness across provider remounts (which can happen during
    // route tree transitions) so the loading gate does not re-appear forever.
    // This avoids a race where init re-enters, emits a second replace, and
    // flashes onboarding/auth trees before biometric lock resolves.
    appInitCompleted = true;
    setIsReady(true);
    SplashScreen.hideAsync().catch(() => {
      // Non-fatal in dev/hot-reload flows where splash may already be hidden.
    });
  }, [isLoading, isComplete, isAuthenticated, pendingVerification, router]);

  return (
    <AppInitContext.Provider value={{ isReady }}>
      {children}
    </AppInitContext.Provider>
  );
}

export function useAppInit(): AppInitContextValue {
  return useContext(AppInitContext);
}
