import { FrameConfig } from "@/constants/frameConfig";
import type { WizardState } from "@/context/WizardContext";
import { MarketAwarenessSliders } from "@/forge/market/MarketAwarenessSliders";
import type { MarketAwarenessInput } from "@/generated/graphql";
import { View } from "react-native";

interface MarketIntelligenceProps {
  marketAwareness: MarketAwarenessInput;
  frameConfig: FrameConfig | null;
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
}

export const MarketIntelligence = ({
  marketAwareness,
  frameConfig,
  updateField,
}: MarketIntelligenceProps) => {
  const marketAwarenessBounds = frameConfig?.bounds.marketAwareness ?? {
    momentum: { min: 0, max: 1 },
    meanReversion: { min: 0, max: 1 },
    volatility: { min: 0, max: 1 },
    trendFollowing: { min: 0, max: 1 },
  };

  return (
    <View>
      <MarketAwarenessSliders
        value={marketAwareness}
        onChange={(v) => updateField("marketAwareness", v)}
        bounds={marketAwarenessBounds}
      />
    </View>
  );
};
