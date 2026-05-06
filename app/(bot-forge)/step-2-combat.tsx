import { FRAME_CONFIG } from "@/constants/frameConfig";
import { useWizard } from "@/context/WizardContext";
import { WizardNavBar } from "@/forge/components/WizardNavBar";
import { ForgeSection } from "@/forge/components/ForgeSection";
import { Capital } from "@/forge/capital";
import { Patience } from "@/forge/patience";
import { Risk } from "@/forge/risk";
import { Tempo } from "@/forge/tempo";
import { disabledReasonFor } from "@/forge/utils";
import { BalanceDocument, type BalanceQuery } from "@/generated/graphql";
import { useQuery } from "@apollo/client/react";
import { useRouter } from "expo-router";
import { Keyboard, Pressable, ScrollView, StyleSheet } from "react-native";

export default function Step2Combat() {
  const { state, updateField, persistDraft } = useWizard();
  const router = useRouter();

  const { data: balanceData } = useQuery<BalanceQuery>(BalanceDocument, {
    fetchPolicy: "cache-first",
  });
  const userCashBalance = parseFloat(
    (balanceData?.balance?.cashBalance as string | null | undefined) ?? "0",
  );

  const frameConfig = state.frameName ? FRAME_CONFIG[state.frameName] : null;
  const allocationBounds = frameConfig?.bounds.allocationPct ?? {
    min: 0.01,
    max: 1.0,
  };

  const combatComplete =
    !!state.riskAttitude && !!state.tradeTempo && !!state.combatPatience;

  async function handleNext() {
    await persistDraft();
    router.push("/(bot-forge)/step-3-intelligence");
  }

  async function handleBack() {
    await persistDraft();
    router.back();
  }

  return (
    <>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.scrollContent}
      >
        <Pressable onPress={() => Keyboard.dismiss()}>
          <ForgeSection
            title="Trade Profile"
            subtitle="How your bot sizes and times its trades."
          >
            <Risk
              frameConfig={frameConfig}
              riskAttitude={state.riskAttitude}
              updateField={updateField}
              disabledReasonFor={disabledReasonFor}
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

          <Capital
            allocationPct={state.allocationPct}
            updateField={updateField}
            allocationBounds={allocationBounds}
            combatComplete={combatComplete}
            existingAllocationTotal={state.existingAllocationTotal}
            userCashBalance={userCashBalance}
            frameName={frameConfig?.gamifiedName ?? null}
          />
        </Pressable>
      </ScrollView>

      <WizardNavBar
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={!combatComplete}
      />
    </>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    gap: 28,
    paddingBottom: 16,
  },
});
