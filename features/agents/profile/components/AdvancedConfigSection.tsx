import { IconSymbol } from "@/components/shared/icon-symbol";
import { Colors } from "@/constants/theme";
import { type BotQuery } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { memo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "./PrimaryButton";
import { Section } from "./Section";
import { StatRow } from "./StatRow";

type Agent = NonNullable<BotQuery["bot"]>;

interface AdvancedConfigSectionProps {
  agent: Agent;
  onRebuild: () => void;
}

function formatSignalWeights(
  sw: Agent["signalWeights"],
): string {
  if (!sw) return "—";
  const t = sw.technicals ?? 0;
  const n = sw.news ?? 0;
  const f = sw.fundamentals ?? 0;
  return `Technicals ${t}% / News ${n}% / Fundamentals ${f}%`;
}

function formatPctFloat(val: number | null | undefined): string {
  if (val == null) return "—";
  return `${(val * 100).toFixed(1)}%`;
}

function formatArray(
  arr: readonly string[] | null | undefined,
): string {
  if (!arr || arr.length === 0) return "—";
  return arr.join(", ");
}

function fmt(val: string | null | undefined): string {
  return val ?? "—";
}

function isEmptyState(agent: Agent): boolean {
  const hasValue = (v: unknown) => {
    if (v == null) return false;
    if (Array.isArray(v)) return v.length > 0;
    return true;
  };
  return (
    !hasValue(agent.signalWeights) &&
    !hasValue(agent.confidenceThreshold) &&
    !hasValue(agent.regimeAwareness) &&
    !hasValue(agent.earningsBehavior) &&
    !hasValue(agent.subSectors) &&
    !hasValue(agent.customWatchlist) &&
    !hasValue(agent.exclusionList) &&
    !hasValue(agent.dividendPreference) &&
    !hasValue(agent.shortInterestSignal) &&
    !hasValue(agent.positionSizingMethod) &&
    !hasValue(agent.minRrRatio) &&
    !hasValue(agent.maxDrawdownProtectionPct) &&
    !hasValue(agent.recoveryMode) &&
    !hasValue(agent.sessionPreference) &&
    !hasValue(agent.dayAvoidance) &&
    !hasValue(agent.volatilityEnvPreference)
  );
}

const AdvancedConfigSection = memo(function AdvancedConfigSection({
  agent,
  onRebuild,
}: AdvancedConfigSectionProps) {
  const theme = Colors[useColorScheme()];
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={[styles.wrapper, { backgroundColor: theme.surface }]}>
      {/* Collapsible header */}
      <Pressable
        style={styles.header}
        onPress={() => setIsExpanded((v) => !v)}
        hitSlop={4}
      >
        <Text style={[styles.headerTitle, { color: theme.textSecondary }]}>
          ADVANCED CONFIGURATION
        </Text>
        <IconSymbol
          name={isExpanded ? "chevron.up" : "chevron.down"}
          size={14}
          color={theme.textSecondary}
        />
      </Pressable>

      {isExpanded && (
        <View style={styles.expandedContent}>
          <Text style={[styles.editNote, { color: theme.textSecondary }]}>
            Edit trading parameters via Rebuild
          </Text>

          {isEmptyState(agent) ? (
            /* Empty state — pre-8b agent */
            <View style={styles.emptyState}>
              <View
                style={[
                  styles.emptyIllustration,
                  { backgroundColor: theme.inputBorder + "33" },
                ]}
              />
              <Text
                style={[styles.emptyTitle, { color: theme.textPrimary }]}
              >
                Upgrade to Advanced Settings via Rebuild
              </Text>
              <PrimaryButton
                label="Rebuild Agent"
                onPress={onRebuild}
                theme={theme}
              />
            </View>
          ) : (
            /* Full content — at least one Feature 8b field is set */
            <View style={styles.groups}>
              {/* Intelligence & Signals */}
              <Section title="INTELLIGENCE & SIGNALS" theme={theme}>
                <StatRow
                  label="Signal Weights"
                  value={formatSignalWeights(agent.signalWeights)}
                  theme={theme}
                />
                <StatRow
                  label="Confidence"
                  value={fmt(agent.confidenceThreshold)}
                  theme={theme}
                />
                <StatRow
                  label="Regime Awareness"
                  value={fmt(agent.regimeAwareness)}
                  theme={theme}
                />
                <StatRow
                  label="Earnings Behavior"
                  value={fmt(agent.earningsBehavior)}
                  theme={theme}
                />
              </Section>

              {/* Universe & Sectors */}
              <Section title="UNIVERSE & SECTORS" theme={theme}>
                <StatRow
                  label="Sub-sectors"
                  value={formatArray(agent.subSectors)}
                  theme={theme}
                />
                <StatRow
                  label="Watchlist"
                  value={formatArray(agent.customWatchlist)}
                  theme={theme}
                />
                <StatRow
                  label="Exclusions"
                  value={formatArray(agent.exclusionList)}
                  theme={theme}
                />
                <StatRow
                  label="Dividend Pref"
                  value={fmt(agent.dividendPreference)}
                  theme={theme}
                />
                <StatRow
                  label="Short Interest"
                  value={fmt(agent.shortInterestSignal)}
                  theme={theme}
                />
              </Section>

              {/* Sizing & Risk */}
              <Section title="SIZING & RISK" theme={theme}>
                <StatRow
                  label="Sizing Method"
                  value={fmt(agent.positionSizingMethod)}
                  theme={theme}
                />
                <StatRow
                  label="Min R/R"
                  value={
                    agent.minRrRatio != null
                      ? String(agent.minRrRatio)
                      : "—"
                  }
                  theme={theme}
                />
                <StatRow
                  label="Max Drawdown"
                  value={formatPctFloat(agent.maxDrawdownProtectionPct)}
                  theme={theme}
                />
                <StatRow
                  label="Recovery Mode"
                  value={fmt(agent.recoveryMode)}
                  theme={theme}
                />
              </Section>

              {/* Timing & Schedule */}
              <Section title="TIMING & SCHEDULE" theme={theme}>
                <StatRow
                  label="Session"
                  value={fmt(agent.sessionPreference)}
                  theme={theme}
                />
                <StatRow
                  label="Day Avoidance"
                  value={formatArray(agent.dayAvoidance)}
                  theme={theme}
                />
                <StatRow
                  label="Volatility Pref"
                  value={fmt(agent.volatilityEnvPreference)}
                  theme={theme}
                />
              </Section>

              {/* Personality & Voice */}
              <Section title="PERSONALITY & VOICE" theme={theme}>
                <StatRow
                  label="Backstory"
                  value={fmt(agent.agentBackground)}
                  theme={theme}
                />
                <StatRow
                  label="Comm Style"
                  value={fmt(agent.proposalCommunicationStyle)}
                  theme={theme}
                />
                <StatRow
                  label="Win Reaction"
                  value={fmt(agent.winReaction)}
                  theme={theme}
                />
                <StatRow
                  label="Loss Reaction"
                  value={fmt(agent.lossReaction)}
                  theme={theme}
                />
              </Section>
            </View>
          )}
        </View>
      )}
    </View>
  );
});

export default AdvancedConfigSection;

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  expandedContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  editNote: {
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 4,
  },
  emptyState: {
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  emptyIllustration: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  groups: {
    gap: 12,
  },
});
