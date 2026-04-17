import { StyleSheet, Text, View } from "react-native";

export default function SectorsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>sectors</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0F1A", alignItems: "center", justifyContent: "center" },
  label: { color: "#FFFFFF", fontSize: 18 },
});
