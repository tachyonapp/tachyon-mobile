import { type ThemeColors } from "@/constants/theme";
import { type BotPerformanceQuery } from "@/generated/graphql";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Section } from "../../components/Section";
import { StatRow } from "../../components/StatRow";

type Perf = NonNullable<BotPerformanceQuery["botPerformance"]>;

interface PerformanceStatsGridProps {
  perf: Perf;
  theme: ThemeColors;
}

function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatPct(value: number): string {
  return `${value.toFixed(2)}%`;
}

function formatHours(value: number): string {
  return `${value.toFixed(1)}h`;
}

export const PerformanceStatsGrid = ({
  perf,
  theme,
}: PerformanceStatsGridProps) => {
  const totalPnl = Number(perf.totalRealizedPnl ?? 0);
  const roac = Number(perf.returnOnAllocatedCapitalPct ?? 0);
  const winCount = perf.winCount ?? 0;
  const lossCount = perf.lossCount ?? 0;
  const noTrades = winCount === 0 && lossCount === 0;

  return (
    <View style={styles.statsGrid}>
      <Section title="RETURNS" theme={theme}>
        {noTrades ? (
          <Text style={[styles.noData, { color: theme.textDisabled }]}>
            No data yet
          </Text>
        ) : (
          <>
            <StatRow
              label="Realized P&L"
              value={formatUsd(totalPnl)}
              theme={theme}
            />
            <StatRow
              label="Return on Capital"
              value={formatPct(roac)}
              theme={theme}
            />
          </>
        )}
      </Section>

      <Section title="TRADE QUALITY" theme={theme}>
        {noTrades ? (
          <Text style={[styles.noData, { color: theme.textDisabled }]}>
            No data yet
          </Text>
        ) : (
          <>
            <StatRow label="Wins" value={String(winCount)} theme={theme} />
            <StatRow label="Losses" value={String(lossCount)} theme={theme} />
            <StatRow
              label="Win Rate"
              value={formatPct(Number(perf.winRatePct ?? 0))}
              theme={theme}
            />
            <StatRow
              label="Profit Factor"
              value={Number(perf.profitFactor ?? 0).toFixed(2)}
              theme={theme}
            />
            <StatRow
              label="Largest Win"
              value={formatUsd(Number(perf.largestSingleWin ?? 0))}
              theme={theme}
            />
            <StatRow
              label="Largest Loss"
              value={formatUsd(Number(perf.largestSingleLoss ?? 0))}
              theme={theme}
            />
          </>
        )}
      </Section>

      <Section title="BEHAVIOR" theme={theme}>
        {noTrades ? (
          <Text style={[styles.noData, { color: theme.textDisabled }]}>
            No data yet
          </Text>
        ) : (
          <>
            <StatRow
              label="Avg Hold Duration"
              value={formatHours(Number(perf.avgHoldDurationHours ?? 0))}
              theme={theme}
            />
            <StatRow
              label="Days Active"
              value={String(perf.daysActive ?? 0)}
              theme={theme}
            />
          </>
        )}
      </Section>

      <Section title="ENGAGEMENT" theme={theme}>
        {perf.totalProposalsGenerated === 0 ? (
          <Text style={[styles.noData, { color: theme.textDisabled }]}>
            No data yet
          </Text>
        ) : (
          <>
            <StatRow
              label="Proposals Generated"
              value={String(perf.totalProposalsGenerated ?? 0)}
              theme={theme}
            />
            <StatRow
              label="Proposals Approved"
              value={String(perf.totalProposalsApproved ?? 0)}
              theme={theme}
            />
            <StatRow
              label="Approval Rate"
              value={formatPct(Number(perf.approvalRatePct ?? 0))}
              theme={theme}
            />
            <StatRow
              label="Skip Rate"
              value={formatPct(Number(perf.skipRatePct ?? 0))}
              theme={theme}
            />
          </>
        )}
      </Section>
    </View>
  );
};

const styles = StyleSheet.create({
  statsGrid: {
    gap: 12,
  },
  noData: {
    fontSize: 13,
    paddingVertical: 6,
  },
});
