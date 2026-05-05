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
 * initial route selection, and splash screen dismissal.
 *
 * Exposes a single `isReady` flag. The root layout gates the Stack on this
 * value — when false, the branded loading screen is shown; when true, the
 * navigator renders with the correct initial route already committed.
 *
 * Must be mounted inside AuthProvider and ApolloProvider.
 */
export function AppInitProvider({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const { isComplete } = useOnboardingState();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const initRef = useRef(false);

  useEffect(() => {
    if (isLoading || isComplete === null) return;
    if (initRef.current) return;
    initRef.current = true;

    if (!isAuthenticated) {
      router.replace("/(auth)/login");
    } else if (!isComplete) {
      router.replace("/(onboarding)");
    }

    SplashScreen.hideAsync();
    setIsReady(true);
  }, [isLoading, isComplete, isAuthenticated]);

  return (
    <AppInitContext.Provider value={{ isReady }}>
      {children}
    </AppInitContext.Provider>
  );
}

export function useAppInit(): AppInitContextValue {
  return useContext(AppInitContext);
}
