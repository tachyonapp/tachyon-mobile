import { FRAME_CONFIG } from "@/constants/frameConfig";
import { useWizard } from "@/context/WizardContext";
import { ForgeNavBar } from "@/features/agents/forge/components/ForgeNavBar";
import { ForgeOptionCard } from "@/features/agents/forge/components/ForgeOptionCard";
import { ForgeSection } from "@/features/agents/forge/components/ForgeSection";
import { TickerTagInput } from "@/features/agents/forge/components/TickerTagInput";
import {
  DividendPreference,
  ShortInterestSignal,
} from "@tachyonapp/tachyon-queue-types/config";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, Pressable, ScrollView, StyleSheet } from "react-native";
import { MarketAwareness } from "./MarketAwareness";
import { SectorGrid } from "./Sectors";
import { SubSectorExpansionPanel } from "./SubSectorExpansionPanel";

const DIVIDEND_OPTIONS: {
  value: DividendPreference;
  label: string;
  description: string;
}[] = [
  {
    value: DividendPreference.PREFER_DIVIDEND,
    label: "Prefer Dividend Stocks",
    description: "Favors stocks that pay regular dividends.",
  },
  {
    value: DividendPreference.NO_PREFERENCE,
    label: "No Preference",
    description: "Dividend status has no bearing on stock selection.",
  },
  {
    value: DividendPreference.EXCLUDE_DIVIDEND,
    label: "Exclude Dividend Stocks",
    description: "Avoids dividend-paying stocks entirely.",
  },
];

const SHORT_INTEREST_OPTIONS: {
  value: ShortInterestSignal;
  label: string;
  description: string;
}[] = [
  {
    value: ShortInterestSignal.TARGET_SHORT_SQUEEZE,
    label: "Target Short Squeeze Candidates",
    description:
      "Actively seeks stocks with high short interest as potential squeeze setups.",
  },
  {
    value: ShortInterestSignal.AVOID_HIGH_SHORT_INTEREST,
    label: "Avoid High Short Interest",
    description:
      "Steers clear of heavily shorted stocks to reduce volatility risk.",
  },
  {
    value: ShortInterestSignal.IGNORE,
    label: "Ignore",
    description: "Short interest data is not factored into stock selection.",
  },
];

export default function Sectors() {
  const {
    state,
    updateField,
    persistDraft,
    parentSectorsData,
    setCustomWatchlist,
    setExclusionList,
    noTickerOverlap,
  } = useWizard();
  const router = useRouter();

  const [sectorAttempted, setSectorAttempted] = useState(false);

  const frameConfig = state.frameName ? FRAME_CONFIG[state.frameName] : null;
  const combatComplete =
    !!state.riskAttitude && !!state.tradeTempo && !!state.combatPatience;

  const marketAwarenessBounds = frameConfig?.bounds.marketAwareness ?? {
    momentum: { min: 0, max: 1 },
    meanReversion: { min: 0, max: 1 },
    volatility: { min: 0, max: 1 },
    trendFollowing: { min: 0, max: 1 },
  };

  const nextBlocked = state.sectors.length === 0 || !noTickerOverlap;

  async function handleNext() {
    if (state.sectors.length === 0) {
      setSectorAttempted(true);
      return;
    }
    if (!noTickerOverlap) return;
    await persistDraft();
    router.push("/(agent-forge)/step-5-protection");
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
            title="Market Behavior"
            subtitle="How your agent interacts with markets"
          >
            <></>
          </ForgeSection>

          <ForgeSection
            title="Intelligence"
            subtitle="Tune your agent's market perception signals."
            tooltip={{
              title: "Market Awareness",
              body: "These weights tune how your agent weighs different market signals. They are independent — they do not need to add up to anything.",
            }}
            locked={!combatComplete}
            lockedMessage="Complete your Trading Profile first."
          >
            <MarketAwareness
              value={state.marketAwareness}
              onChange={(v) => updateField("marketAwareness", v)}
              bounds={marketAwarenessBounds}
            />
          </ForgeSection>

          {/* Sectors — existing, unchanged */}
          <ForgeSection
            title="Sectors"
            subtitle="Select one or more market sectors your agent can trade in."
            locked={!combatComplete}
            lockedMessage="Complete your Trading Profile first."
          >
            <SectorGrid
              selected={state.sectors}
              onChange={(sectors) => {
                updateField("sectors", sectors);
                if (sectors.length > 0) setSectorAttempted(false);
              }}
              showError={sectorAttempted}
            />

            {/* Sub-sector refinement — hidden if parentSectorsData unavailable */}
            <SubSectorExpansionPanel
              selectedSectors={state.sectors}
              parentSectorsData={parentSectorsData}
              subSectors={state.subSectors}
              onChange={(subs) => updateField("subSectors", subs)}
            />
          </ForgeSection>

          {/* Watchlist & exclusion */}
          <ForgeSection
            title="Custom Watchlist"
            subtitle="Specific stocks your agent should focus on within its selected sectors."
            locked={!combatComplete}
            lockedMessage="Complete your Trading Profile first."
          >
            <TickerTagInput
              label="Watchlist"
              value={state.customWatchlist}
              onChange={setCustomWatchlist}
              overlappingTickers={state.exclusionList}
            />
          </ForgeSection>

          <ForgeSection
            title="Exclusion List"
            subtitle="Stocks your agent will never trade, regardless of signals."
            locked={!combatComplete}
            lockedMessage="Complete your Trading Profile first."
          >
            <TickerTagInput
              label="Exclusions"
              value={state.exclusionList}
              onChange={setExclusionList}
              overlappingTickers={state.customWatchlist}
            />
          </ForgeSection>

          {/* Dividend preference */}
          <ForgeSection
            title="Dividend Preference"
            subtitle="How should your agent treat dividend-paying stocks?"
            locked={!combatComplete}
            lockedMessage="Complete your Trading Profile first."
          >
            {DIVIDEND_OPTIONS.map((opt) => (
              <ForgeOptionCard
                key={opt.value}
                label={opt.label}
                description={opt.description}
                selected={state.dividendPreference === opt.value}
                onSelect={() => updateField("dividendPreference", opt.value)}
              />
            ))}
          </ForgeSection>

          {/* Short interest signal */}
          <ForgeSection
            title="Short Interest Signal"
            subtitle="How should your agent use short interest data in its analysis?"
            locked={!combatComplete}
            lockedMessage="Complete your Trading Profile first."
          >
            {SHORT_INTEREST_OPTIONS.map((opt) => (
              <ForgeOptionCard
                key={opt.value}
                label={opt.label}
                description={opt.description}
                selected={state.shortInterestSignal === opt.value}
                onSelect={() => updateField("shortInterestSignal", opt.value)}
              />
            ))}
          </ForgeSection>
        </Pressable>
      </ScrollView>

      <ForgeNavBar
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={nextBlocked}
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
