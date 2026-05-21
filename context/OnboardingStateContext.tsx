import { useAuth } from "@/auth/AuthProvider";
import { CompleteOnboardingDocument, MeDocument } from "@/generated/graphql";
import { useApolloClient, useMutation } from "@apollo/client/react";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const ONBOARDING_KEY = "tachyon.onboarding_complete";
export const ONBOARDING_SYNC_PENDING_KEY = "tachyon.onboarding_sync_pending";
const SECURE_STORE_TIMEOUT_MS = 1500;

interface OnboardingState {
  /**
   * null  = SecureStore read still pending (~20–50ms on device)
   * false = user has not completed FTUE
   * true  = user has completed FTUE
   */
  isComplete: boolean | null;
  markComplete: () => Promise<void>;
}

const OnboardingStateContext = createContext<OnboardingState | null>(null);

export function OnboardingStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isComplete, setIsComplete] = useState<boolean | null>(null);
  const [completeOnboarding] = useMutation(CompleteOnboardingDocument);
  const { isAuthenticated } = useAuth();
  const client = useApolloClient();

  useEffect(() => {
    let cancelled = false;

    const timeout = setTimeout(() => {
      if (!cancelled) {
        setIsComplete(false);
      }
    }, SECURE_STORE_TIMEOUT_MS);

    SecureStore.getItemAsync(ONBOARDING_KEY)
      .then((value) => {
        if (!cancelled) {
          setIsComplete(value === "true");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsComplete(false);
        }
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  const markComplete = useCallback(async (): Promise<void> => {
    await SecureStore.setItemAsync(ONBOARDING_KEY, "true");
    setIsComplete(true);

    try {
      const meData = client.readQuery({ query: MeDocument });
      if (meData?.me?.id) {
        client.cache.modify({
          id: client.cache.identify({ __typename: "User", id: meData.me.id }),
          fields: { onboardingCompleted: () => true },
        });
      }
    } catch {
      // Cache miss is non-fatal — mutation will reconcile server state
    }

    if (!isAuthenticated) {
      await SecureStore.setItemAsync(ONBOARDING_SYNC_PENDING_KEY, "true");
      return;
    }

    completeOnboarding().catch((err) => {
      console.error("[completeOnboarding] mutation failed:", err);
    });
  }, [client, completeOnboarding, isAuthenticated]);

  const value = useMemo(
    () => ({ isComplete, markComplete }),
    [isComplete, markComplete],
  );

  return (
    <OnboardingStateContext.Provider value={value}>
      {children}
    </OnboardingStateContext.Provider>
  );
}

export function useOnboardingState(): OnboardingState {
  const context = useContext(OnboardingStateContext);
  if (!context) {
    throw new Error(
      "useOnboardingState must be used within OnboardingStateProvider",
    );
  }
  return context;
}
