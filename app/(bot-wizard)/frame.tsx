import { FrameCard } from "@/components/wizard/FrameCard";
import { WizardProgressBar } from "@/components/wizard/WizardProgressBar";
import { WizardStepAnimation } from "@/components/wizard/WizardStepAnimation";
import { FRAME_CONFIG } from "@/constants/frameConfig";
import { Colors } from "@/constants/theme";
import { useWizard } from "@/context/WizardContext";
import { BotFrame } from "@/generated/graphql";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const FRAMES = Object.values(BotFrame);
const TOTAL_STEPS = 13;

export default function FrameScreen() {
  const { state, selectFrame } = useWizard();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <WizardProgressBar currentStep={1} totalSteps={TOTAL_STEPS} />

      <FlatList
        data={FRAMES}
        keyExtractor={(item) => item}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <WizardStepAnimation source={null} />
            <Text style={styles.title}>Choose Your Bot Type</Text>
            <Text style={styles.subtitle}>
              {
                "Each frame defines your bot's trading personality and strategy."
              }
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <FrameCard
              frame={FRAME_CONFIG[item]}
              selected={state.frameName === item}
              onSelect={() => selectFrame(item)}
            />
          </View>
        )}
      />

      <View style={styles.footer}>
        <Pressable
          onPress={() => router.push("/(bot-wizard)/risk")}
          disabled={state.frameName === null}
          style={[
            styles.nextBtn,
            state.frameName === null && styles.nextBtnDisabled,
          ]}
        >
          <Text style={styles.nextBtnLabel}>Next</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  header: {
    gap: 12,
    marginBottom: 20,
  },
  title: {
    color: Colors.dark.textPrimary,
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  columnWrapper: {
    gap: 12,
  },
  cardWrapper: {
    flex: 1,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
  },
  nextBtn: {
    height: 52,
    borderRadius: 10,
    backgroundColor: Colors.dark.electricBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  nextBtnDisabled: {
    opacity: 0.35,
  },
  nextBtnLabel: {
    color: Colors.dark.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
});
