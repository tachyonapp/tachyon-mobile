import LottieView from "lottie-react-native";
import { StyleSheet, View } from "react-native";

/**
 * Slide 2 — Market Settings
 */
export function SlideIllustration2() {
  return (
    <View style={styles.container}>
      <LottieView
        source={require("@/assets/animations/chart.json")}
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
