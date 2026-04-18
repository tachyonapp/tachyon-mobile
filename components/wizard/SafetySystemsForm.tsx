import { type FrameConfig } from "@/constants/frameConfig";
import { Colors } from "@/constants/theme";
import {
  StopStyleName,
  type EmotionalControlsInput,
  type StopLossStyleInput,
} from "@/generated/graphql";
import React, { useState } from "react";
import {
  LayoutChangeEvent,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { PillSlider } from "./PillSlider";
import { WizardOptionCard } from "./WizardOptionCard";

interface SafetySystemsFormProps {
  frameName: string;
  dailyMaxLossPct: number;
  onDailyMaxLossChange: (v: number) => void;
  dailyMaxLossBounds: FrameConfig["bounds"]["dailyMaxLoss"];
  allocationPct: number;
  userCashBalance: number;
  dailyMaxGain: number | null;
  onDailyMaxGainChange: (v: number | null) => void;
  stopLossStyle: StopLossStyleInput | null;
  onStopLossStyleChange: (v: StopLossStyleInput) => void;
  emotionalControls: EmotionalControlsInput;
  onEmotionalControlsChange: (v: EmotionalControlsInput) => void;
}

const STOP_LOSS_OPTIONS: { name: StopStyleName; label: string; description: string }[] = [
  {
    name: StopStyleName.Hard,
    label: "Hard Stop",
    description: "Fixed stop-loss level. Exits immediately when hit, no exceptions.",
  },
  {
    name: StopStyleName.Flexible,
    label: "Flexible Stop",
    description: "Adapts to volatility. Gives the trade room to breathe within limits.",
  },
  {
    name: StopStyleName.Adaptive,
    label: "Adaptive Stop",
    description: "Trails price as it moves in your favor. Locks in gains dynamically.",
  },
];

function formatUsd(amount: number): string {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export function SafetySystemsForm({
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
}: SafetySystemsFormProps) {
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
      {/* 1. Daily Max Loss */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Daily Loss Armor</Text>
        <Text style={styles.boundsHint}>
          {lossMinPct}%–{lossMaxPct}% for {frameName}
        </Text>
        <View style={styles.lossValueRow}>
          <Text style={styles.lossValue}>{Math.round(dailyMaxLossPct * 100)}%</Text>
          {lossUsd ? (
            <Text style={styles.lossUsd}>≈ {lossUsd} based on your allocation</Text>
          ) : (
            <Text style={styles.lossUsd}>% of your allocated capital</Text>
          )}
        </View>
        <View onLayout={handleLayout}>
          <PillSlider
            value={dailyMaxLossPct}
            min={dailyMaxLossBounds.minPct}
            max={dailyMaxLossBounds.maxPct}
            onChange={onDailyMaxLossChange}
            fillColor={Colors.dark.danger}
            trackWidth={trackWidth}
          />
        </View>
      </View>

      {/* 2. Daily Max Gain */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Daily Gain Cap (optional)</Text>
        <TextInput
          style={styles.textInput}
          value={gainInput}
          onChangeText={setGainInput}
          onEndEditing={handleGainInputEnd}
          placeholder="Leave blank for no cap."
          placeholderTextColor={Colors.dark.textDisabled}
          keyboardType="decimal-pad"
          returnKeyType="done"
        />
      </View>

      {/* 3. Stop-loss style */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Stop-Loss Style</Text>
        <View style={styles.optionCards}>
          {STOP_LOSS_OPTIONS.map((opt) => (
            <WizardOptionCard
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
        <Text style={styles.sectionLabel}>Emotional Controls</Text>
        <View style={styles.toggleGroup}>
          {/* Freeze after N losses */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabelGroup}>
              <Text style={styles.toggleLabel}>Freeze after losses</Text>
              {emotionalControls.freezeAfterLosses !== null && (
                <TextInput
                  style={styles.nInput}
                  value={String(emotionalControls.freezeAfterLosses ?? "")}
                  onChangeText={(t) => {
                    const n = parseInt(t, 10);
                    onEmotionalControlsChange({
                      ...emotionalControls,
                      freezeAfterLosses: isNaN(n) ? 1 : Math.min(5, Math.max(1, n)),
                    });
                  }}
                  keyboardType="number-pad"
                  maxLength={1}
                  editable={emotionalControls.freezeAfterLosses !== null}
                />
              )}
              {emotionalControls.freezeAfterLosses !== null && (
                <Text style={styles.toggleLabel}> losses in a row</Text>
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
              trackColor={{ true: Colors.dark.electricBlue, false: Colors.dark.surface }}
              thumbColor={Colors.dark.textPrimary}
            />
          </View>

          {/* Cooldown after volatility spike */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Cooldown after volatility spike</Text>
            <Switch
              value={emotionalControls.cooldownAfterVolatility}
              onValueChange={(on) =>
                onEmotionalControlsChange({ ...emotionalControls, cooldownAfterVolatility: on })
              }
              trackColor={{ true: Colors.dark.electricBlue, false: Colors.dark.surface }}
              thumbColor={Colors.dark.textPrimary}
            />
          </View>

          {/* Stand down after noon if losing */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>Stand down after noon if losing</Text>
            <Switch
              value={emotionalControls.standDownAfterNoonIfLosing}
              onValueChange={(on) =>
                onEmotionalControlsChange({
                  ...emotionalControls,
                  standDownAfterNoonIfLosing: on,
                })
              }
              trackColor={{ true: Colors.dark.electricBlue, false: Colors.dark.surface }}
              thumbColor={Colors.dark.textPrimary}
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
  },
  sectionLabel: {
    color: Colors.dark.textPrimary,
    fontSize: 15,
    fontWeight: "600",
  },
  boundsHint: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
  },
  lossValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  lossValue: {
    color: Colors.dark.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  lossUsd: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
  },
  textInput: {
    height: 44,
    borderWidth: 1,
    borderColor: Colors.dark.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: Colors.dark.textPrimary,
    backgroundColor: Colors.dark.inputBackground,
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
    color: Colors.dark.textPrimary,
    fontSize: 14,
    flex: 1,
  },
  nInput: {
    width: 40,
    height: 36,
    borderWidth: 1,
    borderColor: Colors.dark.electricBlue,
    borderRadius: 6,
    color: Colors.dark.textPrimary,
    backgroundColor: Colors.dark.inputBackground,
    textAlign: "center",
    fontSize: 15,
    fontWeight: "600",
    flex: 0,
  },
});
