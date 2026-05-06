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
  const [isReady, setIsReady] = useState(false);
  const initRef = useRef(false);

  useEffect(() => {
    // isLoading includes Clerk readiness + SecureStore verification restore.
    if (isLoading || isComplete === null) return;
    if (initRef.current) return;
    initRef.current = true;

    if (!isAuthenticated && pendingVerification) {
      // Verification was in progress when the app was last closed — return
      // the user directly to the verify screen so they can complete it.
      router.replace("/(auth)/verify");
    } else if (!isAuthenticated) {
      router.replace("/(auth)/login");
    } else if (!isComplete) {
      router.replace("/(onboarding)");
    }
    // authenticated + complete: no replace needed — nav state restoration
    // handles returning the user to wherever they were (e.g. tabs).

    SplashScreen.hideAsync();
    setIsReady(true);
  }, [isLoading, isComplete, isAuthenticated, pendingVerification]);

  return (
    <AppInitContext.Provider value={{ isReady }}>
      {children}
    </AppInitContext.Provider>
  );
}

export function useAppInit(): AppInitContextValue {
  return useContext(AppInitContext);
}
