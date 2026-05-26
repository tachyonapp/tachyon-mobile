import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ModelVariantBadgeProps {
  brainType: string;
  provider: string | null;
  modelId: string | null;
  openaiModelVariant: string | null;
  anthropicModelVariant: string | null;
  groqModelVariant: string | null;
  geminiModelVariant: string | null;
  onChangePress?: () => void;
}

const PROVIDER_COLORS: Record<string, string> = {
  anthropic: "#CC785C",
  openai: "#10A37F",
  groq: "#F55036",
  gemini: "#4285F4",
};

function resolveLabel(
  brainType: string,
  provider: string | null,
  modelId: string | null,
  openaiModelVariant: string | null,
  anthropicModelVariant: string | null,
  groqModelVariant: string | null,
  geminiModelVariant: string | null,
): { providerLabel: string; modelLabel: string; color: string } {
  if (brainType === "TACHYON_HOSTED") {
    return {
      providerLabel: "Tachyon Hosted",
      modelLabel: "Haiku",
      color: "#2C6BED",
    };
  }

  const fallback = modelId ?? "Unknown";

  if (provider === "anthropic") {
    const variant = anthropicModelVariant;
    const modelLabel = variant
      ? variant.charAt(0).toUpperCase() + variant.slice(1)
      : fallback;
    return { providerLabel: "Anthropic", modelLabel, color: PROVIDER_COLORS.anthropic };
  }

  if (provider === "openai") {
    const modelLabel = openaiModelVariant ?? fallback;
    return { providerLabel: "OpenAI", modelLabel, color: PROVIDER_COLORS.openai };
  }

  if (provider === "groq") {
    const modelLabel = groqModelVariant ?? fallback;
    return { providerLabel: "Groq", modelLabel, color: PROVIDER_COLORS.groq };
  }

  if (provider === "gemini") {
    const modelLabel = geminiModelVariant ?? fallback;
    return { providerLabel: "Gemini", modelLabel, color: PROVIDER_COLORS.gemini };
  }

  return { providerLabel: provider ?? "Unknown", modelLabel: fallback, color: "#888" };
}

export function ModelVariantBadge({
  brainType,
  provider,
  modelId,
  openaiModelVariant,
  anthropicModelVariant,
  groqModelVariant,
  geminiModelVariant,
  onChangePress,
}: ModelVariantBadgeProps) {
  const { providerLabel, modelLabel, color } = resolveLabel(
    brainType,
    provider,
    modelId,
    openaiModelVariant,
    anthropicModelVariant,
    groqModelVariant,
    geminiModelVariant,
  );

  const isByok = brainType === "BYOK";

  return (
    <View style={styles.row}>
      <View style={[styles.badge, { backgroundColor: color + "22", borderColor: color + "55" }]}>
        <Text style={[styles.badgeText, { color }]}>
          {providerLabel} · {modelLabel}
        </Text>
      </View>
      {isByok && onChangePress && (
        <TouchableOpacity onPress={onChangePress} hitSlop={8}>
          <Text style={[styles.changeBtn, { color }]}>Change</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: "600",
  },
  changeBtn: {
    fontSize: 13,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});
