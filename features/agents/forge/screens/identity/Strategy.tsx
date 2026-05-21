import { ForgeSection } from "@/features/agents/forge/components/ForgeSection";
import { BotFrame } from "@/generated/graphql";
import {
  BotFrameName,
  FRAME_CONFIG,
} from "@tachyonapp/tachyon-queue-types/config";
import { StyleSheet, View } from "react-native";
import { FrameCard } from "./FrameCard";

interface StrategyProps {
  nameSet: boolean;
  frameName: BotFrameName | null;
  selectFrame: (frame: BotFrameName) => void;
}

const FRAMES = Object.values(BotFrame);

export const Strategy = ({
  nameSet,
  frameName,
  selectFrame,
}: StrategyProps) => {
  return (
    <ForgeSection
      title="Core Strategy"
      subtitle="Your agent's core strategy type"
      tooltip={{
        title: "Personality Frame",
        body: "The strategy type defines your agent's core trading strategy archetype. It sets bounds on all other settings and pre-fills sensible default configurations.",
      }}
      locked={!nameSet}
      lockedMessage="Name your agent first."
    >
      <View style={styles.frameGrid}>
        {FRAMES.map((frame) => (
          <View key={frame} style={styles.frameCardWrapper}>
            <FrameCard
              frame={FRAME_CONFIG[frame]}
              selected={frameName === frame}
              onSelect={() => selectFrame(frame)}
            />
          </View>
        ))}
      </View>
    </ForgeSection>
  );
};

const styles = StyleSheet.create({
  frameGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  frameCardWrapper: {
    width: "48%",
  },
});
