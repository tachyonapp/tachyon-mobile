import { Colors } from "@/constants/theme";
import { UpdateBotBrainDocument } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useMutation } from "@apollo/client/react";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ForgeOptionCard } from "./ForgeOptionCard";
import { OpusCostConfirmationSheet } from "./OpusCostConfirmationSheet";

type PickerMode = "wizard" | "management";

interface ModelVariantPickerProps {
  isVisible: boolean;
  onClose: () => void;
  provider: "openai" | "anthropic" | "groq" | "gemini";
  currentVariant: string | null;
  mode: PickerMode;
  // wizard mode only
  onWizardSelect?: (variant: string) => void;
  // management mode only
  botId?: string;
}

interface VariantOption {
  value: string;
  label: string;
  description: string;
}

const OPENAI_OPTIONS: VariantOption[] = [
  { value: "gpt-4o", label: "gpt-4o", description: "Powerful, higher cost" },
  { value: "gpt-4o-mini", label: "gpt-4o-mini", description: "Fast, lower cost (default)" },
];

const ANTHROPIC_OPTIONS: VariantOption[] = [
  { value: "sonnet", label: "Sonnet", description: "Balanced performance (default)" },
  { value: "opus", label: "Opus", description: "Most powerful" },
  // haiku is reserved for Tachyon-Hosted — not shown here
];

const GROQ_OPTIONS: VariantOption[] = [
  { value: "llama-4-scout", label: "Llama 4 Scout", description: "Fast, low cost" },
  { value: "llama-4-maverick", label: "Llama 4 Maverick", description: "Balanced" },
  { value: "llama-3.3-70b", label: "Llama 3.3 70B", description: "High capability" },
];

const GEMINI_OPTIONS: VariantOption[] = [
  { value: "gemini-2.0-flash", label: "Gemini 2.0 Flash", description: "Fast, low cost" },
  { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash", description: "Balanced performance" },
];

const OPTIONS_BY_PROVIDER: Record<string, VariantOption[]> = {
  openai: OPENAI_OPTIONS,
  anthropic: ANTHROPIC_OPTIONS,
  groq: GROQ_OPTIONS,
  gemini: GEMINI_OPTIONS,
};

const PROVIDER_LABELS: Record<string, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  groq: "Groq",
  gemini: "Gemini",
};

export function ModelVariantPicker({
  isVisible,
  onClose,
  provider,
  currentVariant,
  mode,
  onWizardSelect,
  botId,
}: ModelVariantPickerProps) {
  const theme = Colors[useColorScheme()];
  const [pendingVariant, setPendingVariant] = useState<string | null>(null);
  const [opusGateVisible, setOpusGateVisible] = useState(false);

  const [updateBotBrain, { loading }] = useMutation(UpdateBotBrainDocument);

  const options = OPTIONS_BY_PROVIDER[provider] ?? [];

  const commitSelection = async (variant: string) => {
    if (mode === "wizard") {
      onWizardSelect?.(variant);
      onClose();
    } else {
      if (!botId) return;
      await updateBotBrain({
        variables: { id: botId, input: { modelVariant: variant } },
        update: (cache) => {
          cache.evict({ id: cache.identify({ __typename: "Bot", id: botId }) });
        },
      });
      onClose();
    }
  };

  const handleOptionPress = (variant: string) => {
    if (provider === "anthropic" && variant === "opus") {
      setPendingVariant(variant);
      setOpusGateVisible(true);
    } else {
      commitSelection(variant);
    }
  };

  const handleOpusConfirm = () => {
    setOpusGateVisible(false);
    if (pendingVariant) {
      commitSelection(pendingVariant);
    }
    setPendingVariant(null);
  };

  const handleOpusCancel = () => {
    setOpusGateVisible(false);
    setPendingVariant(null);
  };

  return (
    <>
      <Modal
        visible={isVisible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <Pressable style={styles.overlay} onPress={onClose}>
          <Pressable style={[styles.sheet, { backgroundColor: theme.surface }]}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              {PROVIDER_LABELS[provider] ?? provider} — Model Variant
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.optionsList}
            >
              {options.map((opt) => (
                <ForgeOptionCard
                  key={opt.value}
                  label={opt.label}
                  description={opt.description}
                  selected={currentVariant === opt.value}
                  onSelect={() => !loading && handleOptionPress(opt.value)}
                  disabled={loading}
                />
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      <OpusCostConfirmationSheet
        isVisible={opusGateVisible}
        onConfirm={handleOpusConfirm}
        onCancel={handleOpusCancel}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 24,
    gap: 16,
    maxHeight: "70%",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  optionsList: {
    gap: 10,
    paddingBottom: 8,
  },
});
