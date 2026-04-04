import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";

/**
 * PLACEHOLDER — Lottie asset pending professional designed assets
 *
 * Animation brief:
 *   Concept: You approve every trade — user is in control
 *   Bot presents a trade proposal card to the user. Two buttons appear:
 *   Approve (green checkmark) and Skip (grey X). Bot gestures toward the user
 *   as if handing over the decision. Critical compliance visual.
 *   Style: dark background (#0B0F1A), approve green (#1C9C61), skip grey (#5A6275)
 *   Duration: ~2s, loops on the "presenting" gesture
 *   Copy note: must NOT imply autonomous execution — user approval is the centerpiece
 *
 * Replace `null` source with the delivered .lottie or .json asset path.
 */
export function SlideIllustration3() {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("@/assets/animations/ftue-bot-approval.json")}
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
