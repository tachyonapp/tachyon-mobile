import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";

/**
 * PLACEHOLDER — Lottie asset pending Designer (Katy).
 *
 * Animation brief:
 *   Concept: Victory / bot arena — gamified trading celebration
 *   The bot pumps its fist on a winner's podium, confetti bursts, leaderboard
 *   ranks animate upward. Energetic and celebratory — reinforces the arena/game feel.
 *   Style: dark background (#0B0F1A), gold podium (#F5A623), violet confetti (#8B7CFF),
 *          electric blue highlights (#2C6BED)
 *   Duration: ~2s burst, then loops a gentler idle celebration
 *
 * Replace `null` source with the delivered .lottie or .json asset path.
 */
export function SlideIllustration4() {
  return (
    <View style={styles.container}>
      {/* TODO: replace source with delivered asset from Katy e.g. require("@/assets/animations/ftue-bot-victory.lottie") */}
      <LottieView
        source={require("@/assets/animations/placeholder.json")}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  animation: {
    width: 200,
    height: 200,
  },
});
