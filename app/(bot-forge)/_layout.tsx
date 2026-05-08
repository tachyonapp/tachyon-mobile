import { HeaderNav } from "@/components/layout/header-nav";
import { Colors } from "@/constants/theme";
import { WizardProvider, useWizard } from "@/context/WizardContext";
import { ForgeProgressBar } from "@/forge/components/ForgeProgressBar";
import { MeSubscriptionDocument } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useQuery } from "@apollo/client/react";
import { Redirect, Stack, usePathname, useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  AppState,
  SafeAreaView,
  StyleSheet,
  View,
  type AppStateStatus,
} from "react-native";

// ── Step routing ──────────────────────────────────────────────────────────────

const STEP_NAMES = [
  "step-1-identity",
  "step-2-combat",
  "step-3-intelligence",
  "step-4-protection",
  "step-5-brain",
  "step-6-review",
] as const;

const TOTAL_STEPS = STEP_NAMES.length;

function stepFromPathname(pathname: string): number {
  const idx = STEP_NAMES.findIndex((s) => pathname.includes(s));
  return idx === -1 ? 0 : idx + 1;
}

// ── Inner layout — runs inside WizardProvider ─────────────────────────────────

function ForgeLayoutContent() {
  const { persistDraft } = useWizard();
  const router = useRouter();
  const pathname = usePathname();
  const theme = Colors[useColorScheme()];

  const currentStep = stepFromPathname(pathname);
  const showProgress = currentStep > 0;
  const prevAppState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextState) => {
      if (nextState === "background") {
        persistDraft().catch(console.error);
      }
      if (prevAppState.current === "background" && nextState === "active") {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace("/(tabs)");
        }
      }
      prevAppState.current = nextState;
    });
    return () => sub.remove();
  }, [persistDraft, router]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <HeaderNav navPath="/(tabs)" iconName="close" />

      {showProgress && (
        <ForgeProgressBar currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      )}
      <View style={styles.stackContainer}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.background },
          }}
        />
      </View>
    </SafeAreaView>
  );
}

function ForgeLoadingScreen() {
  const theme = Colors[useColorScheme()];
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ActivityIndicator
        style={styles.loadingIndicator}
        color={theme.electricBlue}
      />
    </SafeAreaView>
  );
}

export default function BotForgeLayout() {
  const { data, loading } = useQuery(MeSubscriptionDocument);

  if (loading) return <ForgeLoadingScreen />;

  if (!data?.me?.subscriptionTier) {
    return (
      <Redirect
        href={{
          pathname: "/(subscription)/tier-selection",
          params: { origin: "bot-forge" },
        }}
      />
    );
  }

  return (
    <WizardProvider>
      <ForgeLayoutContent />
    </WizardProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  stackContainer: { flex: 1 },
  loadingIndicator: { flex: 1 },
});
