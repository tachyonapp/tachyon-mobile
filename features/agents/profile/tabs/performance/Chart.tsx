import { Colors } from "@/constants/theme";
import { BotPerformanceQuery } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { CartesianChart, Line } from "victory-native";

interface PLChartProps {
  data: BotPerformanceQuery | undefined;
}

type TimeRange = "1W" | "1M" | "all";

const RANGES: { key: TimeRange; label: string }[] = [
  { key: "1W", label: "1W" },
  { key: "1M", label: "1M" },
  { key: "all", label: "All Time" },
];

export const PLChart = ({ data }: PLChartProps) => {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("all");
  const theme = Colors[useColorScheme()];

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

  return (
    <View>
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
    </View>
  );
};

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
});
