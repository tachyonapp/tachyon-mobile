import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Props {
  visible: boolean;
  onDismiss: () => void;
  recoveryModeApplied: string | null | undefined;
}

function modeDisplayName(mode: string | null | undefined): string {
  switch (mode) {
    case "NORMAL":
      return "Normal";
    case "MORE_CONSERVATIVE_2D":
      return "Conservative (2 days)";
    case "STAND_DOWN_1W":
      return "Stand Down (1 week)";
    default:
      return "Normal";
  }
}

export function RecoveryModeEducationSheet({
  visible,
  onDismiss,
  recoveryModeApplied,
}: Props) {
  const theme = Colors[useColorScheme()];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onDismiss}
    >
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <Pressable style={[styles.sheet, { backgroundColor: theme.surface }]}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              Recovery Mode
            </Text>

            <View style={styles.section}>
              <Text
                style={[styles.sectionHeading, { color: theme.textPrimary }]}
              >
                What is Recovery Mode?
              </Text>
              <Text
                style={[styles.sectionBody, { color: theme.textSecondary }]}
              >
                $
                {
                  "Recovery Mode is how your agent behaves after it's automatically stood down for hitting its daily loss limit. You configured this in your agent's Safety Systems settings."
                }
              </Text>
            </View>

            <View style={styles.section}>
              <Text
                style={[styles.sectionHeading, { color: theme.textPrimary }]}
              >
                Why does it exist?
              </Text>
              <Text
                style={[styles.sectionBody, { color: theme.textSecondary }]}
              >
                After a tough day, returning immediately to full-size trading
                may increase exposure to further losses. Recovery Mode lets you
                configure a structured return-to-trading schedule for your
                agent.
              </Text>
            </View>

            <View style={styles.section}>
              <Text
                style={[styles.sectionHeading, { color: theme.textPrimary }]}
              >
                The three modes
              </Text>
              <View style={styles.modeList}>
                <View style={styles.modeEntry}>
                  <Text
                    style={[styles.modeLabel, { color: theme.textPrimary }]}
                  >
                    Normal
                  </Text>
                  <Text
                    style={[styles.modeDesc, { color: theme.textSecondary }]}
                  >
                    Your agent resets at market open the next trading day and
                    resumes its normal position sizing.
                  </Text>
                </View>
                <View style={styles.modeEntry}>
                  <Text
                    style={[styles.modeLabel, { color: theme.textPrimary }]}
                  >
                    Conservative (2 days)
                  </Text>
                  <Text
                    style={[styles.modeDesc, { color: theme.textSecondary }]}
                  >
                    Your agent reactivates the next trading day at half its
                    normal position size for 2 trading days, then returns to
                    full sizing automatically.
                  </Text>
                </View>
                <View style={styles.modeEntry}>
                  <Text
                    style={[styles.modeLabel, { color: theme.textPrimary }]}
                  >
                    Stand Down (1 week)
                  </Text>
                  <Text
                    style={[styles.modeDesc, { color: theme.textSecondary }]}
                  >
                    Your agent stays stood down for 7 calendar days. No
                    proposals, no trades during this period.
                  </Text>
                </View>
              </View>
            </View>

            <View
              style={[
                styles.section,
                styles.highlightSection,
                { backgroundColor: theme.background },
              ]}
            >
              <Text
                style={[styles.sectionHeading, { color: theme.textPrimary }]}
              >
                Which mode does my agent use?
              </Text>
              <Text
                style={[styles.sectionBody, { color: theme.textSecondary }]}
              >
                Your agent is configured to use{" "}
                <Text style={{ color: theme.textPrimary, fontWeight: "600" }}>
                  {modeDisplayName(recoveryModeApplied)}
                </Text>
                .
              </Text>
            </View>

            <View style={styles.section}>
              <Text
                style={[styles.sectionHeading, { color: theme.textPrimary }]}
              >
                Can I change this?
              </Text>
              <Text
                style={[styles.sectionBody, { color: theme.textSecondary }]}
              >
                Yes — use the Rebuild action on your agent to update this
                setting. Rebuilding creates a new agent with a clean performance
                history. Your current agent is not deleted automatically.
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[styles.dismissBtn, { backgroundColor: theme.electricBlue }]}
            onPress={onDismiss}
            activeOpacity={0.8}
          >
            <Text style={styles.dismissBtnText}>Got it</Text>
          </TouchableOpacity>
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
    paddingTop: 24,
    paddingHorizontal: 24,
    paddingBottom: 32,
    maxHeight: "85%",
  },
  content: {
    gap: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  section: {
    gap: 8,
  },
  highlightSection: {
    borderRadius: 10,
    padding: 14,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: "700",
  },
  sectionBody: {
    fontSize: 14,
    lineHeight: 21,
  },
  modeList: {
    gap: 12,
  },
  modeEntry: {
    gap: 3,
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  modeDesc: {
    fontSize: 13,
    lineHeight: 19,
  },
  dismissBtn: {
    height: 44,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  dismissBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});
