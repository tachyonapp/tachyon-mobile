import { StyleSheet, Text, View } from "react-native";

export default function PatienceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>patience</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0F1A", alignItems: "center", justifyContent: "center" },
  label: { color: "#FFFFFF", fontSize: 18 },
});
