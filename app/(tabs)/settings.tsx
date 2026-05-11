import { Colors } from "@/constants/theme";
import { BiometricToggle } from "@/features/user/settings/BiometricToggle";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.screenTitle, { color: theme.textPrimary }]}>
        Settings
      </Text>

      <View style={[styles.section, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
          SECURITY
        </Text>
        <BiometricToggle />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 40,
    gap: 24,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  section: {
    borderRadius: 12,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
});
