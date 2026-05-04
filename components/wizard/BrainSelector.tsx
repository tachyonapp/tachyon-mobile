import { Colors } from "@/constants/theme";
import {
  BrainType,
  SubscriptionTier,
  type BrainProviderOption,
} from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRouter } from "expo-router";
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
  hasByokDraft: boolean;
  subscriptionTier?: SubscriptionTier | null;
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
  subscriptionTier,
  onBrainTypeChange,
  onProviderChange,
  onModelChange,
  onValidateKey,
}: BrainSelectorProps) {
  const theme = Colors[useColorScheme()];
  const router = useRouter();
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [validationState, setValidationState] =
    useState<ValidationState>("idle");
  const loadingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedAsByok = useRef(brainType === BrainType.Byok);

  const isByokTier = subscriptionTier === SubscriptionTier.Byok;
  const isTachyonHostedTier =
    subscriptionTier === SubscriptionTier.TachyonHosted;
  const isFreeTrial = subscriptionTier === SubscriptionTier.FreeTrial;

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
    const prov = byokProviders.find((x) => x.provider === p);
    const firstModel = prov?.models?.[0]?.modelId ?? "";
    onModelChange(firstModel);
    setValidationState("idle");
    setApiKeyInput("");
  }

  return (
    <View style={styles.container}>
      {/* Tachyon Hosted card — FREE_TRIAL (or loading) and TACHYON_HOSTED */}
      {!isByokTier && (
        <View
          style={[
            styles.card,
            { backgroundColor: theme.surface },
            { borderWidth: 2, borderColor: theme.electricBlue },
          ]}
        >
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
              {isFreeTrial || !subscriptionTier
                ? "Tachyon Haiku (Free Trial)"
                : "Tachyon Haiku"}
            </Text>
            <View style={styles.badge}>
              <Text style={[styles.badgeText, { color: theme.electricBlue }]}>
                {isFreeTrial || !subscriptionTier
                  ? "40 scans/day"
                  : "78 scans/day"}
              </Text>
            </View>
          </View>
          <Text style={[styles.cardBody, { color: theme.textSecondary }]}>
            Powered by Claude Haiku. Built-in, no setup required.
          </Text>
        </View>
      )}

      {/* BYOK card — BYOK subscription tier only, always expanded */}
      {isByokTier && (
        <View
          style={[
            styles.card,
            { backgroundColor: theme.surface },
            { borderWidth: 2, borderColor: theme.electricBlue },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
            Bring Your Own Key
          </Text>
          <Text style={[styles.cardBody, { color: theme.textSecondary }]}>
            Use your own API key for the best experience.
          </Text>

          <View
            style={[styles.byokExpanded, { borderTopColor: theme.inputBorder }]}
          >
            {hasByokDraft && !isKeyValidated && mountedAsByok.current && (
              <Text style={[styles.draftWarning, { color: theme.warning }]}>
                Your API key was cleared for security. Please re-enter it.
              </Text>
            )}

            {/* Provider selector */}
            {byokProviders.length > 0 && (
              <View style={styles.fieldGroup}>
                <Text
                  style={[styles.fieldLabel, { color: theme.textSecondary }]}
                >
                  Provider
                </Text>
                <View style={styles.segmentRow}>
                  {byokProviders.map((p) => (
                    <Pressable
                      key={p.provider}
                      onPress={() => handleProviderSelect(p.provider ?? "")}
                      style={[
                        styles.segment,
                        {
                          borderColor: theme.textDisabled,
                          backgroundColor: theme.inputBackground,
                        },
                        provider === p.provider && {
                          borderColor: theme.electricBlue,
                          backgroundColor: "rgba(44, 107, 237, 0.1)",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.segmentLabel,
                          { color: theme.textSecondary },
                          provider === p.provider && {
                            color: theme.electricBlue,
                            fontWeight: "600",
                          },
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
                <Text
                  style={[styles.fieldLabel, { color: theme.textSecondary }]}
                >
                  Model
                </Text>
                <View style={styles.segmentRow}>
                  {availableModels.map((m) => (
                    <Pressable
                      key={m.modelId}
                      onPress={() => onModelChange(m.modelId ?? "")}
                      style={[
                        styles.segment,
                        {
                          borderColor: theme.textDisabled,
                          backgroundColor: theme.inputBackground,
                        },
                        modelId === m.modelId && {
                          borderColor: theme.electricBlue,
                          backgroundColor: "rgba(44, 107, 237, 0.1)",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.segmentLabel,
                          { color: theme.textSecondary },
                          modelId === m.modelId && {
                            color: theme.electricBlue,
                            fontWeight: "600",
                          },
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
              <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                API Key
              </Text>
              <TextInput
                style={[
                  styles.keyInput,
                  {
                    borderColor: theme.inputBorder,
                    color: theme.textPrimary,
                    backgroundColor: theme.inputBackground,
                  },
                ]}
                value={apiKeyInput}
                onChangeText={(t) => {
                  setApiKeyInput(t);
                  setValidationState("idle");
                }}
                placeholder="Enter your API key"
                placeholderTextColor={theme.textDisabled}
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
                { backgroundColor: theme.electricBlue },
                (!apiKeyInput || validationState === "loading") &&
                  styles.validateBtnDisabled,
              ]}
            >
              {validationState === "loading" ? (
                <ActivityIndicator size="small" color={theme.textPrimary} />
              ) : (
                <Text style={[styles.validateBtnLabel, { color: "#FFFFFF" }]}>
                  Validate Key
                </Text>
              )}
            </Pressable>

            {validationState === "success" && (
              <Text style={[styles.validationMsg, { color: theme.success }]}>
                Key validated successfully.
              </Text>
            )}
            {validationState === "error" && (
              <Text style={[styles.validationMsg, { color: theme.danger }]}>
                Invalid key. Please check and try again.
              </Text>
            )}
          </View>
        </View>
      )}

      {/* Switch to BYOK — TACHYON_HOSTED only */}
      {isTachyonHostedTier && (
        <Pressable
          onPress={() => router.push("/(subscription)/tier-selection")}
          style={[
            styles.card,
            { backgroundColor: theme.surface, borderColor: theme.textDisabled },
          ]}
        >
          <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>
            Switch to BYOK
          </Text>
          <Text style={[styles.cardBody, { color: theme.textSecondary }]}>
            Use your own API key for unlimited daily market scans.
          </Text>
        </Pressable>
      )}

      {/* Upgrade banner — FREE_TRIAL only */}
      {isFreeTrial && (
        <View
          style={[
            styles.upgradeBanner,
            {
              backgroundColor: "rgba(44, 107, 237, 0.08)",
              borderColor: "rgba(44, 107, 237, 0.25)",
            },
          ]}
        >
          <Text
            style={[styles.upgradeBannerText, { color: theme.textSecondary }]}
          >
            Running on Free Trial — 40 scans/day. Upgrade for 78 scans/day.
          </Text>
          <Pressable
            onPress={() => router.push("/(subscription)/tier-selection")}
          >
            <Text style={[styles.upgradeLink, { color: theme.electricBlue }]}>
              Upgrade
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 16,
    gap: 8,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  cardBody: {
    fontSize: 13,
  },
  badge: {
    backgroundColor: "rgba(44, 107, 237, 0.15)",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "500",
  },
  byokExpanded: {
    marginTop: 8,
    gap: 14,
    borderTopWidth: 1,
    paddingTop: 14,
  },
  draftWarning: {
    fontSize: 13,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
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
    minHeight: 44,
    justifyContent: "center",
  },
  segmentLabel: {
    fontSize: 13,
  },
  keyInput: {
    height: 44,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  validateBtn: {
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  validateBtnDisabled: {
    opacity: 0.4,
  },
  validateBtnLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  validationMsg: {
    fontSize: 13,
  },
  upgradeBanner: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  upgradeBannerText: {
    fontSize: 13,
  },
  upgradeLink: {
    fontSize: 13,
    fontWeight: "600",
  },
});
