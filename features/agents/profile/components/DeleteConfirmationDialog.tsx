import { Colors } from "@/constants/theme";
import {
  DeleteBotDocument,
  PositionStatus,
  type BotQuery,
} from "@/generated/graphql";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useApolloClient, useMutation } from "@apollo/client/react";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Bot = NonNullable<BotQuery["bot"]>;

interface Props {
  bot: Bot;
  visible: boolean;
  onDismiss: () => void;
}

export function DeleteConfirmationDialog({ bot, visible, onDismiss }: Props) {
  const theme = Colors[useColorScheme()];
  const client = useApolloClient();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasOpenPosition =
    bot.activePosition != null &&
    bot.activePosition.status === PositionStatus.Open;

  const [deleteBot] = useMutation(DeleteBotDocument);

  const handleDelete = async () => {
    if (hasOpenPosition || isDeleting) return;
    setIsDeleting(true);
    setError(null);

    try {
      await deleteBot({ variables: { id: bot.id! } });

      const cacheId = client.cache.identify({ __typename: "Bot", id: bot.id });
      if (cacheId) {
        client.cache.evict({ id: cacheId });
        client.cache.gc();
      }

      router.replace("/(tabs)");
    } catch {
      setError("Failed to delete. Please try again.");
      setIsDeleting(false);
    }
  };

  const handleDismiss = () => {
    if (isDeleting) return;
    setError(null);
    onDismiss();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleDismiss}
    >
      <Pressable style={styles.overlay} onPress={handleDismiss}>
        <Pressable style={[styles.dialog, { backgroundColor: theme.surface }]}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Delete {bot.name ?? "Bot"}?
          </Text>

          <Text style={[styles.body, { color: theme.textSecondary }]}>
            This cannot be undone. Your bot and its history will be permanently
            deleted.
          </Text>

          {hasOpenPosition && (
            <Text style={[styles.tooltip, { color: theme.warning }]}>
              Close your open position before deleting.
            </Text>
          )}

          {error != null && (
            <Text style={[styles.errorText, { color: theme.danger }]}>
              {error}
            </Text>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.cancelBtn, { borderColor: theme.inputBorder }]}
              onPress={handleDismiss}
              disabled={isDeleting}
            >
              <Text style={[styles.cancelText, { color: theme.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.deleteBtn,
                {
                  backgroundColor: hasOpenPosition
                    ? theme.textDisabled
                    : "#D64545",
                },
              ]}
              onPress={handleDelete}
              disabled={hasOpenPosition || isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.deleteText}>Delete</Text>
              )}
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
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  dialog: {
    borderRadius: 16,
    padding: 24,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
  },
  tooltip: {
    fontSize: 13,
    fontWeight: "500",
  },
  errorText: {
    fontSize: 13,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
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
  deleteBtn: {
    flex: 1,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  deleteText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
