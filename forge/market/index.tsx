import { FrameConfig } from "@/constants/frameConfig";
import type { WizardState } from "@/context/WizardContext";
import { ForgeSection } from "@/forge/components/ForgeSection";
import { MarketAwarenessSliders } from "@/forge/market/MarketAwarenessSliders";
import type { MarketAwarenessInput } from "@/generated/graphql";

interface MarketIntelligenceProps {
  combatComplete: boolean;
  marketAwareness: MarketAwarenessInput;
  frameConfig: FrameConfig | null;
  updateField: <K extends keyof WizardState>(
    field: K,
    value: WizardState[K],
  ) => void;
}

export const MarketIntelligence = ({
  combatComplete,
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
    <ForgeSection
      title="Market Intelligence"
      subtitle="Tune your bot's market perception signals."
      tooltip={{
        title: "Market Awareness",
        body: "These weights tune how your bot weighs different market signals. They are independent — they do not need to add up to anything.",
      }}
      locked={!combatComplete}
      lockedMessage="Complete your Combat Profile first."
    >
      <MarketAwarenessSliders
        value={marketAwareness}
        onChange={(v) => updateField("marketAwareness", v)}
        bounds={marketAwarenessBounds}
      />
    </ForgeSection>
  );
};
