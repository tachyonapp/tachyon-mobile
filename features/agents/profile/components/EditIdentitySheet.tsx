import { Colors } from "@/constants/theme";
import {
  UpdateAgentIdentityDocument,
  type BotQuery,
} from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  LOSS_REACTION_PRESETS,
  WIN_REACTION_PRESETS,
} from "@tachyonapp/tachyon-queue-types/config";
import { ProposalCommunicationStyle } from "@tachyonapp/tachyon-queue-types/config";
import { useMutation } from "@apollo/client/react";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Agent = NonNullable<BotQuery["bot"]>;

const PRESET_SEEDS = [
  "Phoenix",
  "Titan",
  "Wraith",
  "Specter",
  "Vortex",
  "Cipher",
  "Nexus",
  "Apex",
  "Prism",
];

const SEED_COLORS = [
  "#2C6BED",
  "#8B7CFF",
  "#1C9C61",
  "#F2B705",
  "#D64545",
  "#00BCD4",
  "#FF6B35",
  "#9C27B0",
  "#4CAF50",
];

const COMM_STYLES: ProposalCommunicationStyle[] = [
  ProposalCommunicationStyle.TERSE,
  ProposalCommunicationStyle.DETAILED,
  ProposalCommunicationStyle.AGGRESSIVE_CONFIDENT,
  ProposalCommunicationStyle.CAUTIOUS_MEASURED,
];

const COMM_STYLE_LABELS: Record<ProposalCommunicationStyle, string> = {
  [ProposalCommunicationStyle.TERSE]: "Terse",
  [ProposalCommunicationStyle.DETAILED]: "Detailed",
  [ProposalCommunicationStyle.AGGRESSIVE_CONFIDENT]: "Confident",
  [ProposalCommunicationStyle.CAUTIOUS_MEASURED]: "Measured",
};

function AvatarPickerGrid({
  selectedSeed,
  onSelect,
}: {
  selectedSeed: string;
  onSelect: (seed: string) => void;
}) {
  const theme = Colors[useColorScheme()];

  return (
    <View style={styles.pickerGrid}>
      {PRESET_SEEDS.map((seed, i) => {
        const isSelected = selectedSeed === seed;
        const bg = SEED_COLORS[i % SEED_COLORS.length];
        const initials = seed.slice(0, 2).toUpperCase();
        return (
          <TouchableOpacity
            key={seed}
            style={[
              styles.avatarCell,
              {
                backgroundColor: bg + "33",
                borderColor: isSelected ? theme.electricBlue : "transparent",
              },
            ]}
            onPress={() => onSelect(seed)}
            activeOpacity={0.7}
          >
            <Text style={[styles.avatarInitials, { color: bg }]}>
              {initials}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

interface Props {
  agent: Agent;
  visible: boolean;
  onDismiss: () => void;
}

export function EditIdentitySheet({ agent, visible, onDismiss }: Props) {
  const theme = Colors[useColorScheme()];

  const [name, setName] = useState(agent.name ?? "");
  const [selectedSeed, setSelectedSeed] = useState(agent.avatarSeed ?? "");
  const [backstory, setBackstory] = useState(agent.agentBackground ?? "");
  const [communicationStyle, setCommunicationStyle] =
    useState<ProposalCommunicationStyle | "">(
      agent.proposalCommunicationStyle ?? "",
    );
  const [winReaction, setWinReaction] = useState(agent.winReaction ?? "");
  const [lossReaction, setLossReaction] = useState(agent.lossReaction ?? "");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setName(agent.name ?? "");
      setSelectedSeed(agent.avatarSeed ?? "");
      setBackstory(agent.agentBackground ?? "");
      setCommunicationStyle(agent.proposalCommunicationStyle ?? "");
      setWinReaction(agent.winReaction ?? "");
      setLossReaction(agent.lossReaction ?? "");
    }
  }, [visible, agent]);

  const [updateAgentIdentity] = useMutation(UpdateAgentIdentityDocument);

  const backstoryOverLimit = backstory.length > 300;
  const canSave =
    name.trim().length > 0 &&
    name.length <= 24 &&
    !backstoryOverLimit &&
    !isSaving;

  const handleSave = async () => {
    if (!canSave) return;
    setIsSaving(true);

    try {
      await updateAgentIdentity({
        variables: {
          id: agent.id!,
          input: {
            name,
            avatarSeed: selectedSeed,
            backstory: backstory || null,
            communicationStyle:
              (communicationStyle as ProposalCommunicationStyle) || null,
            winReaction: winReaction || null,
            lossReaction: lossReaction || null,
          },
        },
        update: (cache) => {
          cache.evict({
            id: cache.identify({ __typename: "Bot", id: agent.id }),
          });
        },
      });
      onDismiss();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <Pressable style={[styles.sheet, { backgroundColor: theme.surface }]}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Edit Agent Identity
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Name */}
            <View style={styles.fieldGroup}>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    color: theme.textPrimary,
                    borderColor: theme.inputBorder,
                  },
                ]}
                value={name}
                onChangeText={setName}
                maxLength={24}
                placeholder="Bot name"
                placeholderTextColor={theme.textDisabled}
                returnKeyType="done"
                autoCorrect={false}
                spellCheck={false}
              />
              <Text style={[styles.charCount, { color: theme.textSecondary }]}>
                {name.length}/24
              </Text>
            </View>

            {/* Avatar */}
            <Text
              style={[styles.sectionLabel, { color: theme.textSecondary }]}
            >
              AVATAR
            </Text>
            <AvatarPickerGrid
              selectedSeed={selectedSeed}
              onSelect={setSelectedSeed}
            />

            {/* Backstory */}
            <Text style={[styles.fieldLabel, { color: theme.textPrimary }]}>
              Backstory
            </Text>
            <TextInput
              multiline
              value={backstory}
              onChangeText={setBackstory}
              placeholder="Describe your agent's trading personality..."
              placeholderTextColor={theme.textDisabled}
              style={[
                styles.textArea,
                {
                  backgroundColor: theme.background,
                  color: theme.textPrimary,
                  borderColor: backstoryOverLimit
                    ? "#D64545"
                    : theme.inputBorder,
                },
              ]}
            />
            <Text
              style={[
                styles.charCount,
                backstoryOverLimit && styles.charCountError,
                { color: backstoryOverLimit ? "#D64545" : theme.textSecondary },
              ]}
            >
              {backstory.length}/300
            </Text>

            {/* Communication Style */}
            <Text style={[styles.fieldLabel, { color: theme.textPrimary }]}>
              Communication Style
            </Text>
            <View style={styles.segmentedControl}>
              {COMM_STYLES.map((style) => (
                <TouchableOpacity
                  key={style}
                  style={[
                    styles.segment,
                    {
                      borderColor: theme.inputBorder,
                      backgroundColor:
                        communicationStyle === style
                          ? theme.electricBlue
                          : theme.background,
                    },
                  ]}
                  onPress={() => setCommunicationStyle(style)}
                >
                  <Text
                    style={[
                      styles.segmentText,
                      {
                        color:
                          communicationStyle === style
                            ? "#FFFFFF"
                            : theme.textSecondary,
                      },
                    ]}
                  >
                    {COMM_STYLE_LABELS[style]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Win Reaction */}
            <Text style={[styles.fieldLabel, { color: theme.textPrimary }]}>
              Win Reaction
            </Text>
            {WIN_REACTION_PRESETS.map((phrase) => (
              <TouchableOpacity
                key={phrase}
                style={[
                  styles.reactionOption,
                  {
                    borderColor:
                      winReaction === phrase
                        ? theme.electricBlue
                        : theme.inputBorder,
                    backgroundColor:
                      winReaction === phrase
                        ? theme.electricBlue + "22"
                        : theme.background,
                  },
                ]}
                onPress={() =>
                  setWinReaction(winReaction === phrase ? "" : phrase)
                }
              >
                <Text
                  style={[
                    styles.reactionText,
                    {
                      color:
                        winReaction === phrase
                          ? theme.electricBlue
                          : theme.textPrimary,
                    },
                  ]}
                >
                  {phrase}
                </Text>
              </TouchableOpacity>
            ))}

            {/* Loss Reaction */}
            <Text style={[styles.fieldLabel, { color: theme.textPrimary }]}>
              Loss Reaction
            </Text>
            {LOSS_REACTION_PRESETS.map((phrase) => (
              <TouchableOpacity
                key={phrase}
                style={[
                  styles.reactionOption,
                  {
                    borderColor:
                      lossReaction === phrase
                        ? theme.electricBlue
                        : theme.inputBorder,
                    backgroundColor:
                      lossReaction === phrase
                        ? theme.electricBlue + "22"
                        : theme.background,
                  },
                ]}
                onPress={() =>
                  setLossReaction(lossReaction === phrase ? "" : phrase)
                }
              >
                <Text
                  style={[
                    styles.reactionText,
                    {
                      color:
                        lossReaction === phrase
                          ? theme.electricBlue
                          : theme.textPrimary,
                    },
                  ]}
                >
                  {phrase}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.cancelBtn, { borderColor: theme.inputBorder }]}
              onPress={onDismiss}
            >
              <Text
                style={[styles.cancelText, { color: theme.textSecondary }]}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveBtn,
                {
                  backgroundColor: canSave
                    ? theme.electricBlue
                    : theme.textDisabled,
                },
              ]}
              onPress={handleSave}
              disabled={!canSave}
            >
              <Text style={[styles.saveText, { color: "#FFFFFF" }]}>
                {isSaving ? "Saving…" : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
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
    maxHeight: "90%",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  scrollContent: {
    gap: 16,
    paddingBottom: 8,
  },
  fieldGroup: {
    gap: 4,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 15,
  },
  charCount: {
    fontSize: 12,
    alignSelf: "flex-end",
  },
  charCountError: {
    color: "#D64545",
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: -4,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: -4,
  },
  pickerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  avatarCell: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: "700",
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 80,
    textAlignVertical: "top",
  },
  segmentedControl: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  segment: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: "500",
  },
  reactionOption: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 4,
  },
  reactionText: {
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 4,
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 1,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "500",
  },
  saveBtn: {
    flex: 1,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  saveText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
