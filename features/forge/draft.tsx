import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface DraftProps {
  resumeDraft: () => void;
  startFresh: () => void;
}

export const Draft = ({ resumeDraft, startFresh }: DraftProps) => {
  const theme = Colors[useColorScheme()];
  return (
    <View
      style={[
        styles.draftBanner,
        {
          backgroundColor: theme.surface,
          borderColor: theme.electricBlue,
        },
      ]}
    >
      <Text style={[styles.draftBannerText, { color: theme.textPrimary }]}>
        You have a saved draft. Resume where you left off?
      </Text>
      <View style={styles.draftBannerActions}>
        <Pressable
          onPress={resumeDraft}
          style={[styles.draftBtn, { backgroundColor: theme.electricBlue }]}
        >
          <Text style={styles.draftBtnLabel}>Resume</Text>
        </Pressable>
        <Pressable
          onPress={startFresh}
          style={[
            styles.draftBtn,
            {
              backgroundColor: theme.surface,
              borderWidth: 1,
              borderColor: theme.inputBorder,
            },
          ]}
        >
          <Text style={[styles.draftBtnLabel, { color: theme.textSecondary }]}>
            Start Fresh
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  draftBanner: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    gap: 12,
  },
  draftBannerText: { fontSize: 14, lineHeight: 20 },
  draftBannerActions: { flexDirection: "row", gap: 10 },
  draftBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  draftBtnLabel: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
});
