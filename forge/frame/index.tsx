import { FRAME_CONFIG } from "@/constants/frameConfig";
import { FrameCard } from "@/forge/frame/FrameCard";
import { BotFrame } from "@/generated/graphql";
import { StyleSheet, View } from "react-native";

interface FrameProps {
  frameName: BotFrame | null;
  selectFrame: (frameName: BotFrame) => void;
}

const FRAMES = Object.values(BotFrame);

export const Frame = ({ frameName, selectFrame }: FrameProps) => {
  return (
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
