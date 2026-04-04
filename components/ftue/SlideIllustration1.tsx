import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";

/**
 * PLACEHOLDER — Lottie asset pending professional designed assets
 *
 * Animation brief:
 *   Concept: RPG-style character creation / bot builder
 *   A robot assembles itself piece by piece — head, torso, arms snap into place
 *   with satisfying mechanical clicks. Ends in a idle breathing loop.
 *   Style: dark background (#0B0F1A), violet accent (#8B7CFF), electric blue highlights (#2C6BED)
 *   Duration: ~2.5s build sequence, then loop idle
 *
 * Replace `null` source with the delivered .lottie or .json asset path.
 */
export function SlideIllustration1() {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("@/assets/animations/ftue-bot-builder.json")}
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
