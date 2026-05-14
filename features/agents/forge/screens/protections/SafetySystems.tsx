import { PillSlider } from "@/components/PillSlider";
import { Colors } from "@/constants/theme";
import { ForgeOptionCard } from "@/features/agents/forge/components/ForgeOptionCard";
import {
  StopStyleName,
  type EmotionalControlsInput,
  type StopLossStyleInput,
} from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React, { useState } from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";

interface SafetySystemsProps {
  frameName: string;
  dailyMaxLossPct: number;
  onDailyMaxLossChange: (v: number) => void;
  dailyMaxLossBounds: { minPct: number; maxPct: number };
  allocationPct: number;
  userCashBalance: number;
  dailyMaxGain: number | null;
  onDailyMaxGainChange: (v: number | null) => void;
  stopLossStyle: StopLossStyleInput | null;
  onStopLossStyleChange: (v: StopLossStyleInput) => void;
  emotionalControls: EmotionalControlsInput;
  onEmotionalControlsChange: (v: EmotionalControlsInput) => void;
}

const STOP_LOSS_OPTIONS: {
  name: StopStyleName;
  label: string;
  description: string;
}[] = [
  {
    name: StopStyleName.Hard,
    label: "Hard Stop",
    description:
      "Fixed stop-loss level. Exits immediately when hit, no exceptions.",
  },
  {
    name: StopStyleName.Flexible,
    label: "Flexible Stop",
    description:
      "Adapts to volatility. Gives the trade room to breathe within limits.",
  },
  {
    name: StopStyleName.Adaptive,
    label: "Adaptive Stop",
    description:
      "Trails price as it moves in your favor. Locks in gains dynamically.",
  },
];

function formatUsd(amount: number): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function SafetySystems({
  frameName,
  dailyMaxLossPct,
  onDailyMaxLossChange,
  dailyMaxLossBounds,
  allocationPct,
  userCashBalance,
  dailyMaxGain,
  onDailyMaxGainChange,
  stopLossStyle,
  onStopLossStyleChange,
  emotionalControls,
  onEmotionalControlsChange,
}: SafetySystemsProps) {
  const theme = Colors[useColorScheme()];
  const [trackWidth, setTrackWidth] = useState(0);
  const [gainInput, setGainInput] = useState(
    dailyMaxGain !== null ? String(dailyMaxGain) : "",
  );

  function handleLayout(e: LayoutChangeEvent) {
    setTrackWidth(e.nativeEvent.layout.width);
  }

  function handleGainInputEnd() {
    const parsed = parseFloat(gainInput);
    onDailyMaxGainChange(isNaN(parsed) || gainInput === "" ? null : parsed);
  }

  const lossUsd =
    userCashBalance > 0
      ? formatUsd(dailyMaxLossPct * (allocationPct * userCashBalance))
      : null;

  const lossMinPct = Math.round(dailyMaxLossBounds.minPct * 100);
  const lossMaxPct = Math.round(dailyMaxLossBounds.maxPct * 100);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <View style={styles.lossValueRow}>
          <Text style={[styles.lossValue, { color: theme.textPrimary }]}>
            {Math.round(dailyMaxLossPct * 100)}%
          </Text>
          {lossUsd ? (
            <Text style={[styles.lossUsd, { color: theme.textSecondary }]}>
              ≈ {lossUsd} based on your allocation
            </Text>
          ) : (
            <Text style={[styles.lossUsd, { color: theme.textSecondary }]}>
              % of your allocated capital
            </Text>
          )}
        </View>
        <View onLayout={handleLayout}>
          <PillSlider
            value={dailyMaxLossPct}
            min={dailyMaxLossBounds.minPct}
            max={dailyMaxLossBounds.maxPct}
            onChange={onDailyMaxLossChange}
            fillColor={theme.danger}
            trackWidth={trackWidth}
          />
        </View>
        <Text style={[styles.boundsHint, { color: theme.textSecondary }]}>
          {lossMinPct}%–{lossMaxPct}% for {frameName}
        </Text>
      </View>

      {/* 2. Daily Max Gain */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: theme.textPrimary }]}>
          Daily Gain Cap (optional)
        </Text>
        <TextInput
          style={[
            styles.textInput,
            {
              borderColor: theme.inputBorder,
              color: theme.textPrimary,
              backgroundColor: theme.inputBackground,
            },
          ]}
          value={gainInput}
          onChangeText={setGainInput}
          onEndEditing={handleGainInputEnd}
          placeholder="e.g. 0.05 for a 5% cap. Leave blank for no cap."
          placeholderTextColor={theme.textDisabled}
          keyboardType="decimal-pad"
          returnKeyType="done"
          autoCorrect={false}
        />
      </View>

      {/* 3. Stop-loss style */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: theme.textPrimary }]}>
          Stop-Loss Style
        </Text>
        <View style={styles.optionCards}>
          {STOP_LOSS_OPTIONS.map((opt) => (
            <ForgeOptionCard
              key={opt.name}
              label={opt.label}
              description={opt.description}
              selected={stopLossStyle?.name === opt.name}
              onSelect={() => onStopLossStyleChange({ name: opt.name })}
            />
          ))}
        </View>
      </View>

      {/* 4. Emotional Controls */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: theme.textPrimary }]}>
          Emotional Controls
        </Text>
        <View style={styles.toggleGroup}>
          {/* Freeze after N losses */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabelGroup}>
              <Text style={[styles.toggleLabel, { color: theme.textPrimary }]}>
                Freeze after losses
              </Text>
              {emotionalControls.freezeAfterLosses !== null && (
                <TextInput
                  style={[
                    styles.nInput,
                    {
                      borderColor: theme.electricBlue,
                      color: theme.textPrimary,
                      backgroundColor: theme.inputBackground,
                    },
                  ]}
                  value={String(emotionalControls.freezeAfterLosses ?? "")}
                  onChangeText={(t) => {
                    const n = parseInt(t, 10);
                    onEmotionalControlsChange({
                      ...emotionalControls,
                      freezeAfterLosses: isNaN(n)
                        ? 1
                        : Math.min(5, Math.max(1, n)),
                    });
                  }}
                  keyboardType="number-pad"
                  maxLength={1}
                  editable={emotionalControls.freezeAfterLosses !== null}
                />
              )}
              {emotionalControls.freezeAfterLosses !== null && (
                <Text
                  style={[styles.toggleLabel, { color: theme.textPrimary }]}
                >
                  {" "}
                  losses in a row
                </Text>
              )}
            </View>
            <Switch
              value={emotionalControls.freezeAfterLosses !== null}
              onValueChange={(on) =>
                onEmotionalControlsChange({
                  ...emotionalControls,
                  freezeAfterLosses: on ? 3 : null,
                })
              }
              trackColor={{ true: theme.electricBlue, false: theme.surface }}
              thumbColor={theme.textPrimary}
            />
          </View>

          {/* Cooldown after volatility spike */}
          <View style={styles.toggleRow}>
            <Text style={[styles.toggleLabel, { color: theme.textPrimary }]}>
              Cooldown after volatility spike
            </Text>
            <Switch
              value={emotionalControls.cooldownAfterVolatility}
              onValueChange={(on) =>
                onEmotionalControlsChange({
                  ...emotionalControls,
                  cooldownAfterVolatility: on,
                })
              }
              trackColor={{ true: theme.electricBlue, false: theme.surface }}
              thumbColor={theme.textPrimary}
            />
          </View>

          {/* Stand down after noon if losing */}
          <View style={styles.toggleRow}>
            <Text style={[styles.toggleLabel, { color: theme.textPrimary }]}>
              Stand down after noon if losing
            </Text>
            <Switch
              value={emotionalControls.standDownAfterNoonIfLosing}
              onValueChange={(on) =>
                onEmotionalControlsChange({
                  ...emotionalControls,
                  standDownAfterNoonIfLosing: on,
                })
              }
              trackColor={{ true: theme.electricBlue, false: theme.surface }}
              thumbColor={theme.textPrimary}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 28,
  },
  section: {
    gap: 10,
    marginTop: 15,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  boundsHint: {
    fontSize: 12,
    marginRight: 5,
    textAlign: "right",
  },
  lossValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  lossValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  lossUsd: {
    fontSize: 13,
  },
  textInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  optionCards: {
    gap: 10,
  },
  toggleGroup: {
    gap: 16,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 44,
  },
  toggleLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 6,
    flexWrap: "wrap",
  },
  toggleLabel: {
    fontSize: 14,
    flex: 1,
  },
  nInput: {
    width: 40,
    height: 36,
    borderWidth: 1,
    borderRadius: 6,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    flex: 0,
  },
});
