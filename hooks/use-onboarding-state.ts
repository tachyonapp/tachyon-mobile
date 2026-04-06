import { useAuth } from "@/auth/AuthProvider";
import { CompleteOnboardingDocument, MeDocument } from "@/generated/graphql";
import { useApolloClient, useMutation } from "@apollo/client/react";
import * as SecureStore from "expo-secure-store";
import { useEffect, useState } from "react";

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

export function useOnboardingState(): OnboardingState {
  const [isComplete, setIsComplete] = useState<boolean | null>(null);
  const [completeOnboarding] = useMutation(CompleteOnboardingDocument);
  const { isAuthenticated } = useAuth();
  const client = useApolloClient();

  // Step 1: Read fast-path local cache on mount
  useEffect(() => {
    let cancelled = false;

    // Timeout safety: if SecureStore takes >1500ms, treat as false (route to FTUE)
    // isComplete is always null at this point (mount-only effect), so the check is unnecessary
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
          // SecureStore read failed — conservative: route to FTUE
          setIsComplete(false);
        }
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, []);

  const markComplete = async (): Promise<void> => {
    // 1. Write locally first — user proceeds immediately regardless of network
    await SecureStore.setItemAsync(ONBOARDING_KEY, "true");
    setIsComplete(true);

    // 2. Optimistically update Apollo cache
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

    // 3. Sync to server — deferred if user is not yet authenticated (pre-signup FTUE flow)
    if (!isAuthenticated) {
      // Write a pending flag — (tabs)/_layout.tsx will fire the mutation post-auth
      await SecureStore.setItemAsync(ONBOARDING_SYNC_PENDING_KEY, "true");
      return;
    }

    completeOnboarding().catch((err) => {
      console.error("[completeOnboarding] mutation failed:", err);
    });
  };

  return { isComplete, markComplete };
}
