import { FRAME_CONFIG } from "@/constants/frameConfig";
import { Colors, type ThemeColors } from "@/constants/theme";
import { type BotQuery } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

type Bot = NonNullable<BotQuery["bot"]>;

const RISK_ATTITUDE_LABELS: Record<string, string> = {
  CAUTIOUS: "Cautious",
  BALANCED: "Balanced",
  AGGRESSIVE: "Aggressive",
};

const TRADE_TEMPO_LABELS: Record<string, string> = {
  OPPORTUNISTIC: "Opportunistic",
  ACTIVE: "Active",
  RELENTLESS: "Relentless",
};

const COMBAT_PATIENCE_LABELS: Record<string, string> = {
  IMPULSIVE: "Impulsive",
  CALCULATED: "Calculated",
  PATIENT: "Patient",
  STRATEGIC: "Strategic",
};

function formatPct(value: string | number | null | undefined): string {
  if (value == null) return "—";
  const num = Number(value);
  if (isNaN(num)) return "—";
  return `${(num * 100).toFixed(0)}%`;
}

function Section({
  title,
  children,
  theme,
}: {
  title: string;
  children: React.ReactNode;
  theme: ThemeColors;
}) {
  return (
    <View style={[styles.section, { backgroundColor: theme.surface }]}>
      <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function StatRow({
  label,
  value,
  theme,
}: {
  label: string;
  value: string;
  theme: ThemeColors;
}) {
  return (
    <View style={styles.row}>
      <Text style={[styles.rowLabel, { color: theme.textSecondary }]}>
        {label}
      </Text>
      <Text style={[styles.rowValue, { color: theme.textPrimary }]}>
        {value}
      </Text>
    </View>
  );
}

interface Props {
  bot: Bot;
}

export function ConfigurationTab({ bot }: Props) {
  const theme = Colors[useColorScheme()];

  const frameConfig = bot.frame ? FRAME_CONFIG[bot.frame] : null;
  const colorway = frameConfig?.colorway ?? theme.electricBlue;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      {/* 1. Frame & Identity */}
      <Section title="FRAME & IDENTITY" theme={theme}>
        <View style={styles.identityRow}>
          <View
            style={[styles.colorwaySwatch, { backgroundColor: colorway }]}
          />
          <View style={styles.identityText}>
            <Text style={[styles.frameName, { color: theme.textPrimary }]}>
              {frameConfig?.gamifiedName ?? bot.frame ?? "—"}
            </Text>
            {frameConfig?.strategyName != null && (
              <Text
                style={[styles.strategyName, { color: theme.textSecondary }]}
              >
                {frameConfig.strategyName}
              </Text>
            )}
          </View>
        </View>
        <StatRow label="Bot Name" value={bot.name ?? "—"} theme={theme} />
      </Section>

      {/* 2. Training Parameters */}
      <Section title="TRAINING PARAMETERS" theme={theme}>
        <StatRow
          label="Risk Attitude"
          value={
            bot.riskAttitude
              ? (RISK_ATTITUDE_LABELS[bot.riskAttitude] ?? bot.riskAttitude)
              : "—"
          }
          theme={theme}
        />
        <StatRow
          label="Trade Tempo"
          value={
            bot.tradeTempo
              ? (TRADE_TEMPO_LABELS[bot.tradeTempo] ?? bot.tradeTempo)
              : "—"
          }
          theme={theme}
        />
        <StatRow
          label="Combat Patience"
          value={
            bot.combatPatience
              ? (COMBAT_PATIENCE_LABELS[bot.combatPatience] ??
                bot.combatPatience)
              : "—"
          }
          theme={theme}
        />
        <StatRow
          label="Capital Allocated"
          value={formatPct(bot.allocationPct)}
          theme={theme}
        />
      </Section>

      {/* 3. Safety Systems */}
      <Section title="SAFETY SYSTEMS" theme={theme}>
        <StatRow
          label="Daily Max Loss"
          value={formatPct(bot.dailyMaxLoss)}
          theme={theme}
        />
        <StatRow
          label="Daily Max Gain"
          value={bot.dailyMaxGain != null ? formatPct(bot.dailyMaxGain) : "—"}
          theme={theme}
        />
        <StatRow label="Stop Style" value="—" theme={theme} />
        <StatRow label="Emotional Controls" value="—" theme={theme} />
      </Section>

      {/* 4. Rules of Engagement */}
      <Section title="RULES OF ENGAGEMENT" theme={theme}>
        <StatRow label="Sectors" value="—" theme={theme} />
        <StatRow label="Earnings Avoider" value="—" theme={theme} />
        <StatRow label="Momentum" value="—" theme={theme} />
        <StatRow label="Mean Reversion" value="—" theme={theme} />
        <StatRow label="Volatility" value="—" theme={theme} />
        <StatRow label="Trend Following" value="—" theme={theme} />
      </Section>

      {/* 5. Exit Personality */}
      <Section title="EXIT PERSONALITY" theme={theme}>
        <StatRow label="Exit Style" value="—" theme={theme} />
        <StatRow label="Stop Style" value="—" theme={theme} />
      </Section>

      {/* 6. Brain */}
      <Section title="BRAIN" theme={theme}>
        <StatRow
          label="Brain Type"
          value={bot.botBrainConfig?.brainType ?? "—"}
          theme={theme}
        />
        <StatRow
          label="Model"
          value={bot.botBrainConfig?.modelId ?? "—"}
          theme={theme}
        />
        <StatRow
          label="Provider"
          value={bot.botBrainConfig?.provider ?? "—"}
          theme={theme}
        />
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16, gap: 12, paddingBottom: 32 },
  section: {
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  identityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  colorwaySwatch: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  identityText: {
    flex: 1,
    gap: 2,
  },
  frameName: {
    fontSize: 15,
    fontWeight: "700",
  },
  strategyName: {
    fontSize: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(160,167,184,0.15)",
  },
  rowLabel: {
    fontSize: 13,
  },
  rowValue: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
    marginLeft: 16,
  },
});
