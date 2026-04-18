import { Colors } from "@/constants/theme";
import {
  BrainType,
  type BrainProviderOption,
} from "@/generated/graphql";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface BrainSelectorProps {
  brainType: BrainType;
  provider: string;
  modelId: string;
  byokProviders: BrainProviderOption[];
  isKeyValidated: boolean;
  hasByokDraft: boolean; // true when resuming a BYOK draft (key was cleared)
  onBrainTypeChange: (type: BrainType) => void;
  onProviderChange: (provider: string) => void;
  onModelChange: (modelId: string) => void;
  onValidateKey: (apiKey: string) => Promise<boolean>;
}

type ValidationState = "idle" | "loading" | "success" | "error";

export function BrainSelector({
  brainType,
  provider,
  modelId,
  byokProviders,
  isKeyValidated,
  hasByokDraft,
  onBrainTypeChange,
  onProviderChange,
  onModelChange,
  onValidateKey,
}: BrainSelectorProps) {
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [validationState, setValidationState] = useState<ValidationState>("idle");
  const loadingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selectedProvider = byokProviders.find((p) => p.provider === provider);
  const availableModels = selectedProvider?.models ?? [];

  useEffect(() => {
    return () => {
      if (loadingTimer.current) clearTimeout(loadingTimer.current);
    };
  }, []);

  async function handleValidate() {
    if (!apiKeyInput) return;
    setValidationState("idle");

    // Show loading spinner only after 500ms to avoid flash for fast responses
    loadingTimer.current = setTimeout(() => setValidationState("loading"), 500);

    try {
      const ok = await onValidateKey(apiKeyInput);
      clearTimeout(loadingTimer.current!);
      setValidationState(ok ? "success" : "error");
    } catch {
      clearTimeout(loadingTimer.current!);
      setValidationState("error");
    }
  }

  function handleProviderSelect(p: string) {
    onProviderChange(p);
    // Reset model to first available for new provider
    const prov = byokProviders.find((x) => x.provider === p);
    const firstModel = prov?.models?.[0]?.modelId ?? "";
    onModelChange(firstModel);
    setValidationState("idle");
    setApiKeyInput("");
  }

  return (
    <View style={styles.container}>
      {/* Tachyon Default card */}
      <Pressable
        onPress={() => onBrainTypeChange(BrainType.TachyonHosted)}
        style={[
          styles.card,
          brainType === BrainType.TachyonHosted && styles.cardSelected,
        ]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Tachyon Default</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Usage-capped · No setup required</Text>
          </View>
        </View>
        <Text style={styles.cardBody}>
          Powered by Claude Haiku. Free, built-in, usage-capped.
        </Text>
      </Pressable>

      {/* BYOK card */}
      <Pressable
        onPress={() => onBrainTypeChange(BrainType.Byok)}
        style={[
          styles.card,
          brainType === BrainType.Byok && styles.cardSelected,
        ]}
      >
        <Text style={styles.cardTitle}>Bring Your Own Key</Text>
        <Text style={styles.cardBody}>
          Use your own API key for the best experience.
        </Text>

        {brainType === BrainType.Byok && (
          <View style={styles.byokExpanded}>
            {/* Draft resume warning */}
            {hasByokDraft && !isKeyValidated && (
              <Text style={styles.draftWarning}>
                Your API key was cleared for security. Please re-enter it.
              </Text>
            )}

            {/* Provider selector */}
            {byokProviders.length > 0 && (
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Provider</Text>
                <View style={styles.segmentRow}>
                  {byokProviders.map((p) => (
                    <Pressable
                      key={p.provider}
                      onPress={() => handleProviderSelect(p.provider ?? "")}
                      style={[
                        styles.segment,
                        provider === p.provider && styles.segmentSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.segmentLabel,
                          provider === p.provider && styles.segmentLabelSelected,
                        ]}
                      >
                        {p.displayName ?? p.provider}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* Model selector */}
            {availableModels.length > 0 && (
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Model</Text>
                <View style={styles.segmentRow}>
                  {availableModels.map((m) => (
                    <Pressable
                      key={m.modelId}
                      onPress={() => onModelChange(m.modelId ?? "")}
                      style={[
                        styles.segment,
                        modelId === m.modelId && styles.segmentSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.segmentLabel,
                          modelId === m.modelId && styles.segmentLabelSelected,
                        ]}
                        numberOfLines={1}
                      >
                        {m.displayName ?? m.modelId}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}

            {/* API key input */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>API Key</Text>
              <TextInput
                style={styles.keyInput}
                value={apiKeyInput}
                onChangeText={(t) => {
                  setApiKeyInput(t);
                  setValidationState("idle");
                }}
                placeholder="Enter your API key"
                placeholderTextColor={Colors.dark.textDisabled}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            {/* Validate button */}
            <Pressable
              onPress={handleValidate}
              disabled={!apiKeyInput || validationState === "loading"}
              style={[
                styles.validateBtn,
                (!apiKeyInput || validationState === "loading") && styles.validateBtnDisabled,
              ]}
            >
              {validationState === "loading" ? (
                <ActivityIndicator size="small" color={Colors.dark.textPrimary} />
              ) : (
                <Text style={styles.validateBtnLabel}>Validate Key</Text>
              )}
            </Pressable>

            {validationState === "success" && (
              <Text style={styles.validationSuccess}>Key validated successfully.</Text>
            )}
            {validationState === "error" && (
              <Text style={styles.validationError}>Invalid key. Please check and try again.</Text>
            )}
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  card: {
    backgroundColor: Colors.dark.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.dark.textDisabled,
    padding: 16,
    gap: 8,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: Colors.dark.electricBlue,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  cardTitle: {
    color: Colors.dark.textPrimary,
    fontSize: 15,
    fontWeight: "600",
  },
  cardBody: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
  },
  badge: {
    backgroundColor: "rgba(44, 107, 237, 0.15)",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: Colors.dark.electricBlue,
    fontSize: 11,
    fontWeight: "500",
  },
  byokExpanded: {
    marginTop: 8,
    gap: 14,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.inputBorder,
    paddingTop: 14,
  },
  draftWarning: {
    color: Colors.dark.warning,
    fontSize: 13,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    color: Colors.dark.textSecondary,
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  segmentRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  segment: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.dark.textDisabled,
    backgroundColor: Colors.dark.inputBackground,
    minHeight: 44,
    justifyContent: "center",
  },
  segmentSelected: {
    borderColor: Colors.dark.electricBlue,
    backgroundColor: "rgba(44, 107, 237, 0.1)",
  },
  segmentLabel: {
    color: Colors.dark.textSecondary,
    fontSize: 13,
  },
  segmentLabelSelected: {
    color: Colors.dark.electricBlue,
    fontWeight: "600",
  },
  keyInput: {
    height: 44,
    borderWidth: 1,
    borderColor: Colors.dark.inputBorder,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: Colors.dark.textPrimary,
    backgroundColor: Colors.dark.inputBackground,
    fontSize: 15,
  },
  validateBtn: {
    height: 44,
    borderRadius: 8,
    backgroundColor: Colors.dark.electricBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  validateBtnDisabled: {
    opacity: 0.4,
  },
  validateBtnLabel: {
    color: Colors.dark.textPrimary,
    fontSize: 15,
    fontWeight: "600",
  },
  validationSuccess: {
    color: Colors.dark.success,
    fontSize: 13,
  },
  validationError: {
    color: Colors.dark.danger,
    fontSize: 13,
  },
});
