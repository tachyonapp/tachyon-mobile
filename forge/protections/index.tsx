import { FrameConfig } from "@/constants/frameConfig";
import type { WizardState } from "@/context/WizardContext";
import { SafetySystemsForm } from "@/forge/protections/SafetySystemsForm";
import {
  EmotionalControlsInput,
  StopLossStyleInput,
} from "@/generated/graphql";
import { View } from "react-native";

interface ProtectionsProps {
  frameConfig: FrameConfig | null;
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
  dailyMaxLoss,
  dailyMaxLossBounds,
  allocationPct,
  userCashBalance,
  dailyMaxGain,
  stopLossStyle,
  emotionalControls,
  updateField,
}: ProtectionsProps) => {
  return (
    <View>
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
    </View>
  );
};
