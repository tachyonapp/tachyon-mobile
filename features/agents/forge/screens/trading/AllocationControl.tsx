import { Colors } from "@/constants/theme";
import { ForgeOptionCard } from "@/features/agents/forge/components/ForgeOptionCard";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface AllocationControlProps {
  value: number;
  onChange: (v: number) => void;
  existingTotal: number;
  userCashBalance: number;
}

const PRESETS = [500, 1000, 2500, 5000, 10000];

function formatUsd(amount: number): string {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

export function AllocationControl({
  value,
  onChange,
  existingTotal,
  userCashBalance,
}: AllocationControlProps) {
  const theme = Colors[useColorScheme()];
  const [customMode, setCustomMode] = useState(!PRESETS.includes(value));
  const [customInput, setCustomInput] = useState(String(value));

  const availableBalance = Math.max(0, userCashBalance - existingTotal);

  const existingFrac =
    userCashBalance > 0 ? Math.min(existingTotal / userCashBalance, 1) : 0;
  const currentFrac =
    userCashBalance > 0
      ? Math.min(value / userCashBalance, Math.max(0, 1 - existingFrac))
      : 0;
  const availableFrac = Math.max(0, 1 - existingFrac - currentFrac);

  function handleCustomEnd() {
    const parsed = parseFloat(customInput.replace(/[^0-9.]/g, ""));
    if (!isNaN(parsed) && parsed > 0) {
      onChange(parsed);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.energyBar}>
        {existingFrac > 0 && (
          <View
            style={[
              styles.segment,
              { flex: existingFrac, backgroundColor: theme.warning },
            ]}
          />
        )}
        {currentFrac > 0 && (
          <View
            style={[
              styles.segment,
              { flex: currentFrac, backgroundColor: theme.electricBlue },
            ]}
          />
        )}
        {availableFrac > 0 && (
          <View
            style={[
              styles.segment,
              { flex: availableFrac, backgroundColor: theme.surface },
            ]}
          />
        )}
      </View>

      <View style={styles.legend}>
        {existingTotal > 0 && (
          <View style={styles.legendItem}>
            <View
              style={[styles.legendDot, { backgroundColor: theme.warning }]}
            />
            <Text style={[styles.legendText, { color: theme.textSecondary }]}>
              Other agents {formatUsd(existingTotal)}
            </Text>
          </View>
        )}
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: theme.electricBlue }]}
          />
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>
            This agent {formatUsd(value)}
          </Text>
        </View>
        <View style={styles.legendItem}>
          <View
            style={[styles.legendDot, { backgroundColor: theme.inputBorder }]}
          />
          <Text style={[styles.legendText, { color: theme.textSecondary }]}>
            Available {formatUsd(availableBalance)}
          </Text>
        </View>
      </View>

      <View style={styles.presets}>
        {PRESETS.map((preset) => (
          <ForgeOptionCard
            key={preset}
            label={formatUsd(preset)}
            description={
              userCashBalance > 0
                ? `${Math.round((preset / userCashBalance) * 100)}% of your balance`
                : ""
            }
            selected={!customMode && value === preset}
            onSelect={() => {
              setCustomMode(false);
              onChange(preset);
            }}
            disabled={userCashBalance > 0 && preset > availableBalance}
            disabledReason={`Exceeds available balance of ${formatUsd(availableBalance)}`}
          />
        ))}
        <ForgeOptionCard
          label="Custom"
          description="Enter a specific dollar amount"
          selected={customMode}
          onSelect={() => {
            setCustomMode(true);
            setCustomInput(String(value));
          }}
        />
      </View>

      {customMode && (
        <View style={styles.customInputRow}>
          <Text style={[styles.currencySymbol, { color: theme.textPrimary }]}>
            $
          </Text>
          <TextInput
            style={[
              styles.customInput,
              {
                borderColor: theme.electricBlue,
                color: theme.textPrimary,
                backgroundColor: theme.inputBackground,
              },
            ]}
            value={customInput}
            onChangeText={setCustomInput}
            onEndEditing={handleCustomEnd}
            onBlur={handleCustomEnd}
            placeholder="e.g. 3000"
            placeholderTextColor={theme.textDisabled}
            keyboardType="decimal-pad"
            returnKeyType="done"
            autoFocus
          />
        </View>
      )}

      {userCashBalance === 0 && (
        <Text style={[styles.fundingPrompt, { color: theme.warning }]}>
          Fund your account to activate this agent!
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12, marginTop: 15 },
  energyBar: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  segment: { height: "100%" },
  legend: { flexDirection: "row", gap: 16, flexWrap: "wrap" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 12 },
  presets: { gap: 8 },
  customInputRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  currencySymbol: { fontSize: 20, fontWeight: "600" },
  customInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 20,
    fontWeight: "600",
  },
  fundingPrompt: { fontSize: 14, textAlign: "center" },
});
