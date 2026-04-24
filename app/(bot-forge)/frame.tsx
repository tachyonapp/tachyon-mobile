import { ForgeSection } from "@/components/forge/ForgeSection";
import { FrameCard } from "@/components/wizard/FrameCard";
import { FRAME_CONFIG } from "@/constants/frameConfig";
import { BotFrame } from "@/generated/graphql";
import { StyleSheet, View } from "react-native";

interface FrameProps {
  name: string;
  frameName: BotFrame | null;
  selectFrame: (frameName: BotFrame) => void;
}

const FRAMES = Object.values(BotFrame);

export const Frame = ({ name, frameName, selectFrame }: FrameProps) => {
  const nameSet = name.trim().length > 0;
  return (
    <ForgeSection
      title="Personality"
      subtitle="Your bot's trading personality and strategy."
      tooltip={{
        title: "Bot Frame",
        body: "The frame defines your bot's core strategy archetype. It sets bounds on all other settings and pre-fills sensible defaults.",
      }}
      locked={!nameSet}
      lockedMessage="Name your bot first."
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
