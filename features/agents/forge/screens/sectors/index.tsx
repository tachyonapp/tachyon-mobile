import { useWizard } from "@/context/WizardContext";
import { ForgeNavBar } from "@/features/agents/forge/components/ForgeNavBar";
import { ForgeSection } from "@/features/agents/forge/components/ForgeSection";
import { TickerTagInput } from "@/features/agents/forge/components/TickerTagInput";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Keyboard, Pressable, ScrollView, StyleSheet } from "react-native";
import { Dividend } from "./Dividend";
import { MarketAwareness } from "./MarketAwareness";
import { SectorGrid } from "./Sectors";
import { ShortInterest } from "./ShortInterest";
import { SubSectorExpansionPanel } from "./SubSectorExpansionPanel";

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

  const combatComplete =
    !!state.riskAttitude && !!state.tradeTempo && !!state.combatPatience;

  const marketAwarenessBounds = {
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

          <MarketAwareness
            value={state.marketAwareness}
            onChange={(v) => updateField("marketAwareness", v)}
            bounds={marketAwarenessBounds}
            combatComplete={combatComplete}
          />

          {/* Sectors — existing, unchanged */}
          <SectorGrid
            selected={state.sectors}
            onChange={(sectors) => {
              updateField("sectors", sectors);
              if (sectors.length > 0) setSectorAttempted(false);
            }}
            showError={sectorAttempted}
            combatComplete={combatComplete}
          />

          {/* Sub-sector refinement — hidden if parentSectorsData unavailable */}
          <SubSectorExpansionPanel
            selectedSectors={state.sectors}
            parentSectorsData={parentSectorsData}
            subSectors={state.subSectors}
            onChange={(subs) => updateField("subSectors", subs)}
          />

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
          <Dividend
            updateField={updateField}
            combatComplete={combatComplete}
            dividendPreference={state.dividendPreference}
          />

          {/* Short interest signal */}
          <ShortInterest
            updateField={updateField}
            combatComplete={combatComplete}
            shortInterestSignal={state.shortInterestSignal}
          />
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
