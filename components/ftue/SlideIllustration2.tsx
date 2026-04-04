import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";

/**
 * PLACEHOLDER — Lottie asset pending professional designed assets
 *
 * Animation brief:
 *   Concept: Bot scanning the market
 *   The assembled bot from slide 1 stands with glowing eyes, scanning a live
 *   ticker/waveform that pulses across the screen. Data streams flow into the bot.
 *   Style: dark background (#0B0F1A), violet accent (#8B7CFF), electric blue data streams (#2C6BED)
 *   Duration: seamless loop ~3s
 *
 * Replace `null` source with the delivered .lottie or .json asset path.
 */
export function SlideIllustration2() {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("@/assets/animations/ftue-bot-scanning.json")}
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
