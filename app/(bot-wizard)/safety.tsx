import { StyleSheet, Text, View } from "react-native";

export default function SafetyScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>safety</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0F1A", alignItems: "center", justifyContent: "center" },
  label: { color: "#FFFFFF", fontSize: 18 },
});
