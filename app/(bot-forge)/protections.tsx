import { ForgeSection } from "@/components/forge/ForgeSection";
import { SafetySystemsForm } from "@/components/wizard/SafetySystemsForm";
import { FrameConfig } from "@/constants/frameConfig";
import type { WizardState } from "@/context/WizardContext";
import {
  EmotionalControlsInput,
  ExitPersonalityInput,
  StopLossStyleInput,
} from "@/generated/graphql";

interface ProtectionsProps {
  frameConfig: FrameConfig | null;
  exitPersonality: ExitPersonalityInput | null;
  dailyMaxLoss: number;
  allocationPct: number;
  userCashBalance: number;
  dailyMaxLossBounds: { minPct: number; maxPct: number };
  dailyMaxGain: number | null;
  stopLossStyle: StopLossStyleInput | null;
  emotionalControls: EmotionalControlsInput;
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
}

export const Protections = ({
  frameConfig,
  exitPersonality,
  dailyMaxLoss,
  dailyMaxLossBounds,
  allocationPct,
  userCashBalance,
  dailyMaxGain,
  stopLossStyle,
  emotionalControls,
  updateField,
}: ProtectionsProps) => {
  const exitSet = exitPersonality !== null;

  return (
    <ForgeSection
      title="Protections"
      subtitle="Configure safety limits to protect your capital."
      locked={!exitSet}
      lockedMessage="Choose an exit strategy first."
    >
      <SafetySystemsForm
        frameName={frameConfig?.gamifiedName ?? "your frame"}
        dailyMaxLossPct={dailyMaxLoss}
        onDailyMaxLossChange={(v) => updateField("dailyMaxLoss", v)}
        dailyMaxLossBounds={dailyMaxLossBounds}
        allocationPct={allocationPct}
        userCashBalance={userCashBalance}
        dailyMaxGain={dailyMaxGain}
        onDailyMaxGainChange={(v) => updateField("dailyMaxGain", v)}
        stopLossStyle={stopLossStyle}
        onStopLossStyleChange={(v) => updateField("stopLossStyle", v)}
        emotionalControls={emotionalControls}
        onEmotionalControlsChange={(v) => updateField("emotionalControls", v)}
      />
    </ForgeSection>
  );
};
