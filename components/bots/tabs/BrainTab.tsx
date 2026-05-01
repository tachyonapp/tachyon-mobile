import { Colors, type ThemeColors } from "@/constants/theme";
import { type BotQuery } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Bot = NonNullable<BotQuery["bot"]>;

const SCAN_CAP_FREE_TRIAL = 40;
const SCAN_CAP_TACHYON_HOSTED = 78;

function ScanCapBar({
  used,
  cap,
  theme,
}: {
  used: number;
  cap: number;
  theme: ThemeColors;
}) {
  const pct = cap > 0 ? Math.min(used / cap, 1) : 0;
  return (
    <View style={[styles.capBarTrack, { backgroundColor: theme.inputBorder }]}>
      <View
        style={[
          styles.capBarFill,
          {
            width: `${pct * 100}%`,
            backgroundColor: pct >= 0.9 ? theme.danger : theme.electricBlue,
          },
        ]}
      />
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

function PrimaryButton({
  label,
  onPress,
  theme,
}: {
  label: string;
  onPress: () => void;
  theme: ThemeColors;
}) {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.electricBlue }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>{label}</Text>
    </TouchableOpacity>
  );
}

function SecondaryButton({
  label,
  onPress,
  theme,
}: {
  label: string;
  onPress: () => void;
  theme: ThemeColors;
}) {
  return (
    <TouchableOpacity
      style={[styles.buttonSecondary, { borderColor: theme.electricBlue }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonTextSecondary, { color: theme.electricBlue }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function FreeTrial({ bot, theme }: { bot: Bot; theme: ThemeColors }) {
  const router = useRouter();
  const used = bot.scanCapUsed ?? 0;
  const remaining = bot.scanCapRemaining ?? SCAN_CAP_FREE_TRIAL;

  return (
    <>
      <StatRow label="Brain" value="Tachyon Haiku (Free Trial)" theme={theme} />
      <StatRow
        label="Daily Scan Cap"
        value={`${SCAN_CAP_FREE_TRIAL} scans/day`}
        theme={theme}
      />
      <StatRow label="Scans Used Today" value={String(used)} theme={theme} />
      <StatRow label="Scans Remaining" value={String(remaining)} theme={theme} />
      <ScanCapBar used={used} cap={SCAN_CAP_FREE_TRIAL} theme={theme} />
      <PrimaryButton
        label="Unlock more daily market scans"
        onPress={() => router.push("/(subscription)/tier-selection" as never)}
        theme={theme}
      />
    </>
  );
}

function TachyonHosted({ bot, theme }: { bot: Bot; theme: ThemeColors }) {
  const router = useRouter();
  const used = bot.scanCapUsed ?? 0;
  const remaining = bot.scanCapRemaining ?? SCAN_CAP_TACHYON_HOSTED;

  return (
    <>
      <StatRow label="Brain" value="Tachyon Haiku" theme={theme} />
      <StatRow
        label="Daily Scan Cap"
        value={`${SCAN_CAP_TACHYON_HOSTED} scans/day`}
        theme={theme}
      />
      <StatRow label="Scans Used Today" value={String(used)} theme={theme} />
      <StatRow label="Scans Remaining" value={String(remaining)} theme={theme} />
      <ScanCapBar used={used} cap={SCAN_CAP_TACHYON_HOSTED} theme={theme} />
      <SecondaryButton
        label="Switch to BYOK"
        onPress={() => router.push("/(subscription)/tier-selection" as never)}
        theme={theme}
      />
    </>
  );
}

function Byok({ bot, theme }: { bot: Bot; theme: ThemeColors }) {
  const router = useRouter();
  const config = bot.botBrainConfig;
  const provider = config?.provider ?? "Unknown";
  const keyPreview = config?.keyPreview;
  const keyConfigured = keyPreview != null;

  return (
    <>
      <StatRow
        label="Brain"
        value={`Your Key — ${provider}`}
        theme={theme}
      />
      <StatRow
        label="Key Status"
        value={keyConfigured ? "Active" : "Not Configured"}
        theme={theme}
      />
      {keyConfigured && (
        <StatRow
          label="Key Preview"
          value={`•••• ${keyPreview}`}
          theme={theme}
        />
      )}
      <StatRow label="Daily Scan Cap" value="Unlimited" theme={theme} />
      <SecondaryButton
        label="Manage API Key"
        onPress={() =>
          router.push("/(bot-forge)/brain" as never)
        }
        theme={theme}
      />
    </>
  );
}

function brainVariant(brainType: string | null | undefined): "FREE_TRIAL" | "BYOK" | "TACHYON_HOSTED" {
  if (brainType === "BYOK") return "BYOK";
  if (brainType === "TACHYON_HOSTED") return "TACHYON_HOSTED";
  return "FREE_TRIAL";
}

interface Props {
  bot: Bot;
}

export function BrainTab({ bot }: Props) {
  const theme = Colors[useColorScheme()];
  const variant = brainVariant(bot.botBrainConfig?.brainType);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
          BRAIN CONFIG
        </Text>
        {variant === "FREE_TRIAL" && (
          <FreeTrial bot={bot} theme={theme} />
        )}
        {variant === "TACHYON_HOSTED" && (
          <TachyonHosted bot={bot} theme={theme} />
        )}
        {variant === "BYOK" && (
          <Byok bot={bot} theme={theme} />
        )}
      </View>
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
  capBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 2,
    marginBottom: 4,
  },
  capBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  button: {
    borderRadius: 10,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  buttonSecondary: {
    borderRadius: 10,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
    borderWidth: 1,
  },
  buttonTextSecondary: {
    fontSize: 14,
    fontWeight: "600",
  },
});
