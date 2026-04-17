import { StyleSheet, Text, View } from "react-native";

export default function IdentityScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>identity</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B0F1A", alignItems: "center", justifyContent: "center" },
  label: { color: "#FFFFFF", fontSize: 18 },
});
