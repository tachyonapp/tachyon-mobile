import { useAuth } from "@/auth/AuthProvider";
import { useOnboardingState } from "@/hooks/use-onboarding-state";
import { useWizard } from "@/context/WizardContext";
import { useRouter, useRootNavigationState } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { AppState } from "react-native";

interface AppInitContextValue {
  isReady: boolean;
  isAuthenticated: boolean;
  isOnboarded: boolean;
}

const AppInitContext = createContext<AppInitContextValue>({
  isReady: false,
  isAuthenticated: false,
  isOnboarded: false,
});

// Module-level sentinel used to survive provider remounts.
// Without this, a remount resets local state to `false` and can re-run startup
// redirects, causing visible route flashes and loading-loop behavior.
let appInitCompleted = false;

/**
 * Orchestrates app shell startup: initial and foreground route selection,
 * splash dismissal, and the isReady gate.
 *
 * Consumes auth (useAuth) and FTUE completion (useOnboardingState) but does
 * not own either — onboarding persistence and markComplete live in
 * OnboardingStateProvider.
 *
 * Exposes isReady, isAuthenticated, and isOnboarded so RootNavigator can
 * use Stack.Protected without importing auth or onboarding hooks directly.
 *
 * Must be mounted inside AuthProvider, ApolloProvider, and
 * OnboardingStateProvider.
 */
export function AppInitProvider({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated, pendingVerification } = useAuth();
  const { isComplete } = useOnboardingState();
  const { isLoading: wizardIsLoading } = useWizard();
  const router = useRouter();
  // useRootNavigationState resolves once the navigation container has finished
  // initializing, including any navigation state restoration from persistence.
  // Routing before rootNavState?.key is truthy means router.replace() races
  // against restoration and can lose — the restored state overwrites our call.
  const rootNavState = useRootNavigationState();
  const isNavReady = !!rootNavState?.key;

  const [isReady, setIsReady] = useState(appInitCompleted);
  // Mirrors the module sentinel inside the effect lifecycle.
  // Prevents multiple router.replace calls when dependencies re-evaluate
  // during the same mounted lifetime.
  const initRef = useRef(appInitCompleted);

  // Startup routing — fires once per JS context, after the nav container and
  // all async state (Clerk, SecureStore) have resolved.
  useEffect(() => {
    if (!isNavReady || isLoading || isComplete === null || wizardIsLoading) return;
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
      router.replace("/(auth)/verify");
    } else if (!isAuthenticated) {
      router.replace("/(auth)/login");
    } else if (!isComplete) {
      router.replace("/(onboarding)");
    } else {
      router.replace("/(tabs)/feed");
    }

    // Persist readiness across provider remounts (which can happen during
    // route tree transitions) so the loading gate does not re-appear forever.
    appInitCompleted = true;
    setIsReady(true);
    SplashScreen.hideAsync().catch(() => {
      // Non-fatal in dev/hot-reload flows where splash may already be hidden.
    });
  }, [isNavReady, isLoading, isComplete, isAuthenticated, pendingVerification, router, wizardIsLoading]);

  // Foreground routing — re-runs the decision tree whenever the app becomes
  // active. The Stack is always mounted (biometric lock renders as an overlay,
  // not a Stack replacement), so router.replace() always has a valid target.
  useEffect(() => {
    if (!isReady) return;

    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState !== "active") return;
      if (!isAuthenticated && pendingVerification) {
        router.replace("/(auth)/verify");
      } else if (!isAuthenticated) {
        router.replace("/(auth)/login");
      } else if (!isComplete) {
        router.replace("/(onboarding)");
      } else {
        router.replace("/(tabs)/feed");
      }
    });

    return () => subscription.remove();
  }, [isReady, isAuthenticated, isComplete, pendingVerification, router]);

  return (
    <AppInitContext.Provider
      value={{
        isReady,
        isAuthenticated,
        isOnboarded: isComplete === true,
      }}
    >
      {children}
    </AppInitContext.Provider>
  );
}

export function useAppInit(): AppInitContextValue {
  return useContext(AppInitContext);
}
