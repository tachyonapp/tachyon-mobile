import { Colors } from "@/constants/theme";
import { UpdateBotIdentityDocument, type BotQuery } from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useApolloClient, useMutation } from "@apollo/client/react";
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Bot = NonNullable<BotQuery["bot"]>;

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
  bot: Bot;
  visible: boolean;
  onDismiss: () => void;
}

export function EditIdentitySheet({ bot, visible, onDismiss }: Props) {
  const theme = Colors[useColorScheme()];
  const client = useApolloClient();

  const [name, setName] = useState(bot.name ?? "");
  const [selectedSeed, setSelectedSeed] = useState(bot.name ?? "");
  const [isSaving, setIsSaving] = useState(false);

  // Reset state each time the sheet opens
  useEffect(() => {
    if (visible) {
      setName(bot.name ?? "");
      setSelectedSeed(bot.name ?? "");
    }
  }, [visible, bot.name]);

  const [updateBotIdentity] = useMutation(UpdateBotIdentityDocument);

  const canSave = name.trim().length > 0 && name.length <= 24 && !isSaving;

  const handleSave = async () => {
    if (!canSave) return;
    setIsSaving(true);

    const previousName = bot.name ?? "";
    const cacheId = client.cache.identify({ __typename: "Bot", id: bot.id });

    // Optimistic name update
    if (cacheId) {
      client.cache.modify({
        id: cacheId,
        fields: { name: () => name },
      });
    }

    try {
      await updateBotIdentity({
        variables: {
          id: bot.id!,
          input: { name, avatarSeed: `${name + Date.now().toString()}` },
        },
      });
      onDismiss();
    } catch {
      // Rollback on error
      if (cacheId) {
        client.cache.modify({
          id: cacheId,
          fields: { name: () => previousName },
        });
      }
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
            Edit Bot Identity
          </Text>

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

          <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
            AVATAR
          </Text>
          <AvatarPickerGrid
            selectedSeed={selectedSeed}
            onSelect={setSelectedSeed}
          />

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.cancelBtn, { borderColor: theme.inputBorder }]}
              onPress={onDismiss}
            >
              <Text style={[styles.cancelText, { color: theme.textSecondary }]}>
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
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
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
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
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
