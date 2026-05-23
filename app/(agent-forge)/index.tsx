import { useRouter } from "expo-router";
import { useEffect } from "react";

/**
 * Forge entry gate. Replaces immediately to step-1 so there is no blank
 * screen while WizardContext initialises. Step-1 renders with the current
 * wizard state (EMPTY_STATE on fresh open) and re-renders when the draft is
 * found — the draft banner appears as soon as AsyncStorage resolves (~20ms).
 */
export default function ForgeGate() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/(agent-forge)/step-1-identity");
  }, [router]);

  return null;
}
