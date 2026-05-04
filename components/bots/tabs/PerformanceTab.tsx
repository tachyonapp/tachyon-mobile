import { Colors, type ThemeColors } from "@/constants/theme";
import {
  BotPerformanceDocument,
  type BotPerformanceQuery,
} from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useQuery } from "@apollo/client/react";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CartesianChart, Line } from "victory-native";

type Perf = NonNullable<BotPerformanceQuery["botPerformance"]>;
type TimeRange = "1W" | "1M" | "all";

const RANGES: { key: TimeRange; label: string }[] = [
  { key: "1W", label: "1W" },
  { key: "1M", label: "1M" },
  { key: "all", label: "All Time" },
];

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

interface StatRowProps {
  label: string;
  value: string;
  theme: ThemeColors;
}

function StatRow({ label, value, theme }: StatRowProps) {
  return (
    <View style={styles.statRow}>
      <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.statValue, { color: theme.textPrimary }]}>
        {value}
      </Text>
    </View>
  );
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
  theme: ThemeColors;
}

function Section({ title, children, theme }: SectionProps) {
  return (
    <View style={[styles.section, { backgroundColor: theme.surface }]}>
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function PerformanceStatsGrid({
  perf,
  theme,
}: {
  perf: Perf;
  theme: ThemeColors;
}) {
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
}

interface Props {
  botId: string;
}

export function PerformanceTab({ botId }: Props) {
  const theme = Colors[useColorScheme()];
  const [selectedRange, setSelectedRange] = useState<TimeRange>("all");

  const { data, loading } = useQuery(BotPerformanceDocument, {
    variables: { id: botId },
    fetchPolicy: "network-only",
  });

  const perf = data?.botPerformance;

  const filteredSeries = useMemo(() => {
    if (!perf?.pnlTimeSeries) return [];
    const now = Date.now();
    const cutoff =
      selectedRange === "1W"
        ? now - 7 * 24 * 60 * 60 * 1000
        : selectedRange === "1M"
          ? now - 30 * 24 * 60 * 60 * 1000
          : 0;
    return perf.pnlTimeSeries.filter(
      (p) => p.date && new Date(p.date).getTime() >= cutoff,
    );
  }, [perf?.pnlTimeSeries, selectedRange]);

  if (loading && !perf) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator color={theme.electricBlue} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* Time range selector */}
      <View style={[styles.rangeSelector, { backgroundColor: theme.surface }]}>
        {RANGES.map(({ key, label }) => {
          const isActive = selectedRange === key;
          return (
            <Pressable
              key={key}
              style={[
                styles.rangeBtn,
                isActive && { backgroundColor: theme.electricBlue },
              ]}
              onPress={() => setSelectedRange(key)}
            >
              <Text
                style={[
                  styles.rangeBtnText,
                  {
                    color: isActive ? theme.textPrimary : theme.textSecondary,
                  },
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* P&L Chart */}
      {filteredSeries.length > 0 ? (
        <View
          style={[styles.chartContainer, { backgroundColor: theme.surface }]}
        >
          <CartesianChart
            data={filteredSeries.map((p, i) => ({
              index: i,
              pnl: Number(p.cumulativePnl ?? 0),
            }))}
            xKey="index"
            yKeys={["pnl"]}
            axisOptions={{ font: null, lineColor: theme.inputBorder }}
          >
            {({ points }) => (
              <Line
                points={points.pnl}
                color={theme.electricBlue}
                strokeWidth={2}
                animate={{ type: "timing", duration: 300 }}
              />
            )}
          </CartesianChart>
        </View>
      ) : (
        <View style={[styles.emptyChart, { backgroundColor: theme.surface }]}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No trade history for this period
          </Text>
        </View>
      )}

      {perf && <PerformanceStatsGrid perf={perf} theme={theme} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  rangeSelector: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 4,
    gap: 4,
  },
  rangeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  rangeBtnText: {
    fontSize: 13,
    fontWeight: "600",
  },
  chartContainer: {
    borderRadius: 12,
    overflow: "hidden",
  },
  emptyChart: {
    height: 160,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 13,
  },
  statsGrid: {
    gap: 12,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    gap: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(160,167,184,0.15)",
  },
  statLabel: {
    fontSize: 13,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "600",
  },
  noData: {
    fontSize: 13,
    paddingVertical: 6,
  },
});
