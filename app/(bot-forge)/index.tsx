import { FRAME_CONFIG } from "@/constants/frameConfig";
import { Colors } from "@/constants/theme";
import { useWizard } from "@/context/WizardContext";
import { ForgeSection } from "@/forge/components/ForgeSection";
import { ForgeStatPanel } from "@/forge/components/ForgeStatPanel";
import {
  BalanceDocument,
  BrainType,
  CreateBotDocument,
  type BalanceQuery,
  type CreateBotMutation,
  type CreateBotMutationVariables,
} from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useMutation, useQuery } from "@apollo/client/react";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  AppState,
  Keyboard,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  type AppStateStatus,
} from "react-native";

import { Brain } from "../../forge/brain";
import { Capital } from "../../forge/capital";
import { Deploy, DeployError } from "../../forge/deploy";
import { Draft } from "../../forge/draft";
import { Engagement } from "../../forge/engagement";
import { Exit } from "../../forge/exit";
import { Frame } from "../../forge/frame";
import { Identity } from "../../forge/identity";
import { MarketIntelligence } from "../../forge/market";
import { Patience } from "../../forge/patience";
import { Protections } from "../../forge/protections";
import { Risk } from "../../forge/risk";
import { Sectors } from "../../forge/sectors";
import { Tempo } from "../../forge/tempo";

// ── Helpers ───────────────────────────────────────────────────────────────────

function disabledReasonFor(
  frameName: string,
  label: string,
  count: number,
): string {
  return `${frameName} only supports ${label}${count !== 1 ? "s" : ""}.`;
}

export default function ForgeScreen() {
  const theme = Colors[useColorScheme()];
  const {
    state,
    selectFrame,
    updateField,
    updateBrain,
    brainCatalog,
    clearDraft,
    persistDraft,
    draftPrompt,
    resumeDraft,
    startFresh,
  } = useWizard();
  const router = useRouter();
  const { height: screenHeight } = useWindowDimensions();
  const [nameFocused, setNameFocused] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [sectorAttempted, setSectorAttempted] = useState(false);
  const [isKeyValidated, setIsKeyValidated] = useState(false);
  const [deploying, setDeploying] = useState(false);
  const [deployError, setDeployError] = useState<DeployError | null>(null);

  // When the app is backgrounded while the forge is open, persist the draft so
  // data isn't lost. When it returns to the foreground, navigate back to the
  // bots list — the forge is a transient creation flow, not a persistent destination.
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

  // ── Remote data ───────────────────────────────────────────────────────────
  const { data: balanceData } = useQuery<BalanceQuery>(BalanceDocument, {
    fetchPolicy: "cache-first",
  });
  const userCashBalance = parseFloat(
    (balanceData?.balance?.cashBalance as string | null | undefined) ?? "0",
  );

  // ── Mutations ─────────────────────────────────────────────────────────────
  const [createBot] = useMutation<
    CreateBotMutation,
    CreateBotMutationVariables
  >(CreateBotDocument);

  // ── Frame-dependent bounds ────────────────────────────────────────────────
  const frameConfig = state.frameName ? FRAME_CONFIG[state.frameName] : null;
  const allocationBounds = frameConfig?.bounds.allocationPct ?? {
    min: 0.01,
    max: 1.0,
  };
  const dailyMaxLossBounds = frameConfig?.bounds.dailyMaxLoss ?? {
    minPct: 0,
    maxPct: 1,
  };

  // ── Progressive unlock ────────────────────────────────────────────────────
  const combatComplete =
    !!state.riskAttitude && !!state.tradeTempo && !!state.combatPatience;
  const stopLossSet = state.stopLossStyle !== null;

  // ── Validation ────────────────────────────────────────────────────────────
  const isDailyMaxLossValid =
    state.dailyMaxLoss >= dailyMaxLossBounds.minPct &&
    state.dailyMaxLoss <= dailyMaxLossBounds.maxPct;

  const canDeploy =
    state.name.trim().length > 0 &&
    !!state.colorway &&
    state.frameName !== null &&
    state.riskAttitude !== null &&
    state.tradeTempo !== null &&
    state.combatPatience !== null &&
    state.sectors.length > 0 &&
    state.exitPersonality !== null &&
    state.stopLossStyle !== null &&
    isDailyMaxLossValid &&
    (state.brain.brainType === BrainType.TachyonHosted || isKeyValidated);

  // ── Deploy ──────────────────────────────────────────────────────────────
  async function handleDeploy() {
    if (deploying) return;
    if (!state.name.trim()) {
      setNameError(true);
      return;
    }
    if (state.sectors.length === 0) {
      setSectorAttempted(true);
      return;
    }
    setDeploying(true);
    setDeployError(null);

    try {
      const { data } = await createBot({
        variables: {
          input: {
            name: state.name,
            frameName: state.frameName!,
            avatarId: state.avatarId || state.name,
            colorway: state.colorway,
            allocationPct: String(state.allocationPct),
            riskAttitude: state.riskAttitude!,
            tradeTempo: state.tradeTempo!,
            combatPatience: state.combatPatience!,
            marketAwareness: state.marketAwareness,
            sectors: state.sectors,
            exitPersonality: state.exitPersonality!,
            stopLossStyle: state.stopLossStyle!,
            dailyMaxLossPct: String(state.dailyMaxLoss),
            dailyMaxGain:
              state.dailyMaxGain !== null
                ? String(state.dailyMaxGain)
                : undefined,
            emotionalControls: state.emotionalControls,
            rulesOfEngagement: state.rulesOfEngagement,
            brain: {
              brainType: state.brain.brainType,
              modelId: state.brain.modelId,
              provider: state.brain.provider,
              apiKey: state.brain.apiKey ?? undefined,
            },
          },
        },
      });

      const result = data?.createBot;
      if (result?.__typename === "ValidationError") {
        setDeployError({
          kind: "validation",
          message: result.message ?? "Validation failed.",
          field: result.field,
        });
        setDeploying(false);
        return;
      }

      await clearDraft();
      router.replace("/(tabs)/index");
    } catch (err) {
      console.log(err, "ass");
      const gqlErrors: { extensions?: { code?: string } }[] =
        (err as any)?.graphQLErrors ?? [];
      const rateLimited = gqlErrors.some(
        (e) => e.extensions?.code === "RATE_LIMITED",
      );
      setDeployError(
        rateLimited ? { kind: "rate_limited" } : { kind: "network" },
      );
      setDeploying(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.statPanelContainer}>
        <ForgeStatPanel
          name={state.name}
          state={state}
          height={Math.round(screenHeight * 0.49)}
          onClose={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/(tabs)");
            }
          }}
        />
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Pressable
          onPress={() => Keyboard.dismiss()}
          style={styles.scrollContent}
        >
          {/* Draft resume banner */}
          {draftPrompt === "resume-or-fresh" && (
            <Draft resumeDraft={resumeDraft} startFresh={startFresh} />
          )}

          {/* ── 1. Identity ── */}
          <Identity
            name={state.name}
            nameFocused={nameFocused}
            nameError={nameError}
            updateField={updateField}
            setNameError={setNameError}
            setNameFocused={setNameFocused}
          />

          {/* ── 2. Frame ── */}
          <Frame
            name={state.name}
            frameName={state.frameName}
            selectFrame={selectFrame}
          />

          {/* ── 4. Trade Profile ── */}
          <ForgeSection
            title="Trade Profile"
            subtitle="How your bot sizes and times its trades."
            locked={state.frameName === null}
            lockedMessage="Choose a frame first."
          >
            <Risk
              frameConfig={frameConfig}
              updateField={updateField}
              disabledReasonFor={disabledReasonFor}
              riskAttitude={state.riskAttitude}
            />
            <Tempo
              frameConfig={frameConfig}
              tradeTempo={state.tradeTempo}
              updateField={updateField}
              disabledReasonFor={disabledReasonFor}
            />
            <Patience
              frameConfig={frameConfig}
              combatPatience={state.combatPatience}
              updateField={updateField}
              disabledReasonFor={disabledReasonFor}
            />
          </ForgeSection>

          {/* ── 4. Capital Allocation ── */}
          <Capital
            allocationPct={state.allocationPct}
            updateField={updateField}
            allocationBounds={allocationBounds}
            combatComplete={combatComplete}
            existingAllocationTotal={state.existingAllocationTotal}
            userCashBalance={userCashBalance}
            frameName={frameConfig?.gamifiedName ?? null}
          />

          {/* ── 5. Market Intelligence ── */}
          <MarketIntelligence
            combatComplete={combatComplete}
            marketAwareness={state.marketAwareness}
            frameConfig={frameConfig}
            updateField={updateField}
          />

          {/* ── 6. Sectors ── */}
          <Sectors
            combatComplete={combatComplete}
            sectors={state.sectors}
            updateField={updateField}
            sectorAttempted={sectorAttempted}
            setSectorAttempted={setSectorAttempted}
          />

          {/* ── 7. Exit Strategy ── */}
          <Exit
            sectors={state.sectors}
            updateField={updateField}
            exitPersonality={state.exitPersonality}
          />

          {/* ── 8. Protections ── */}
          <Protections
            frameConfig={frameConfig}
            exitPersonality={state.exitPersonality}
            dailyMaxLoss={state.dailyMaxLoss}
            allocationPct={state.allocationPct}
            userCashBalance={userCashBalance}
            dailyMaxLossBounds={dailyMaxLossBounds}
            dailyMaxGain={state.dailyMaxGain}
            stopLossStyle={state.stopLossStyle}
            emotionalControls={state.emotionalControls}
            updateField={updateField}
          />

          {/* ── 9. Rules of Engagement ── */}
          <Engagement
            stopLossSet={stopLossSet}
            rulesOfEngagement={state.rulesOfEngagement}
            updateField={updateField}
          />

          {/* ── 10. Brain ── */}
          <Brain
            stopLossSet={stopLossSet}
            brain={state.brain}
            brainCatalog={brainCatalog}
            isKeyValidated={isKeyValidated}
            updateBrain={updateBrain}
            setIsKeyValidated={setIsKeyValidated}
          />

          {/* ── Compliance + Deploy ── */}
          <Deploy
            deploying={deploying}
            canDeploy={canDeploy}
            deployError={deployError}
            handleDeploy={handleDeploy}
          />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  statPanelContainer: {
    marginTop: 2,
  },
  safe: { flex: 1 },
  scrollContent: {
    padding: 16,
    gap: 28,
    paddingBottom: 48,
  },
});
