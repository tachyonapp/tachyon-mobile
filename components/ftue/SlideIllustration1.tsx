import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";

/**
 * Slide 1 — Bot Builder / Assembly
 *
 * Animation concept: Geometric "bot frame" — abstract modular UI card tiles
 * snap into a symmetrical 3×3 dashboard grid, one tile at a time, staggered.
 * After the build sequence each tile gently pulses its opacity in idle loop.
 * Style: dark background (#0B0F1A), violet accent (#8B7CFF), electric blue (#2C6BED)
 * Implementation: react-native-reanimated, pure View primitives. No robot, no Lottie.
 */
export function SlideIllustration1() {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("@/assets/animations/buildingblocks.json")}
        autoPlay
        loop
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 260,
    height: 260,
    alignItems: "center",
    justifyContent: "center",
  },
  animation: {
    width: 300,
    height: 300,
  },
});
