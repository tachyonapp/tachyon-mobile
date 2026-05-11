import { FRAME_CONFIG } from "@/constants/frameConfig";
import { useWizard } from "@/context/WizardContext";
import { ForgeNavBar } from "@/features/agents/forge/components/ForgeNavBar";
import { ForgeSection } from "@/features/agents/forge/components/ForgeSection";
import { disabledReasonFor } from "@/features/agents/forge/utils";
import { BalanceDocument, type BalanceQuery } from "@/generated/graphql";
import { useQuery } from "@apollo/client/react";
import { useRouter } from "expo-router";
import { Keyboard, Pressable, ScrollView, StyleSheet } from "react-native";
import { Allocation } from "./Allocation";
import { Patience } from "./Patience";
import { RiskProfile } from "./RiskProfile";
import { Tempo } from "./Tempo";

export default function TradingProfile() {
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
            subtitle="How your agent sizes and times its trades."
          >
            <></>
          </ForgeSection>

          <ForgeSection
            title="Risk Attitude"
            subtitle="Set risk tolerance"
            tooltip={{
              title: "Risk Attitude",
              body: "Controls how large each position is relative to your agents's allocated capital.",
            }}
          >
            <RiskProfile
              frameConfig={frameConfig}
              riskAttitude={state.riskAttitude}
              updateField={updateField}
              disabledReasonFor={disabledReasonFor}
            />
          </ForgeSection>

          <ForgeSection
            title="Trade Tempo"
            subtitle="Set trading frequency"
            tooltip={{
              title: "Trading Tempo",
              body: "Controls how often your agent looks for new opportunities.",
            }}
          >
            <Tempo
              frameConfig={frameConfig}
              tradeTempo={state.tradeTempo}
              updateField={updateField}
              disabledReasonFor={disabledReasonFor}
            />
          </ForgeSection>

          <ForgeSection
            title="Trading Patience"
            subtitle="Set position hold time"
            tooltip={{
              title: "Trading Patience",
              body: "Sets how long your agent must hold a position before exiting. Longer holds reduce Pattern Day Trading risk as defined by FINRA. For more information on Pattern Day Trading rules see: https://www.finra.org/investors/investing/investment-products/stocks/day-trading",
            }}
          >
            <Patience
              frameConfig={frameConfig}
              combatPatience={state.combatPatience}
              updateField={updateField}
              disabledReasonFor={disabledReasonFor}
            />
          </ForgeSection>

          <ForgeSection
            title="Capital Allocation"
            subtitle="How much of your total account funds will this agent use?"
            tooltip={{
              title: "Capital Allocation",
              body: "This is the percentage of your total account balance that this agent can use. Multiple agents share your capital — allocated total cannot exceed 100%.",
            }}
            locked={!combatComplete}
            lockedMessage="Set Trade Tempo first."
          >
            <Allocation
              allocationPct={state.allocationPct}
              updateField={updateField}
              allocationBounds={allocationBounds}
              combatComplete={combatComplete}
              existingAllocationTotal={state.existingAllocationTotal}
              userCashBalance={userCashBalance}
              frameName={frameConfig?.gamifiedName ?? null}
            />
          </ForgeSection>
        </Pressable>
      </ScrollView>

      <ForgeNavBar
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
