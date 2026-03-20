import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { StyleSheet, Text, View } from "react-native";

interface AuthErrorStateProps {
  message: string;
  type: "auth_failed" | "network" | "session_expired";
}
export function AuthErrorState({ message }: AuthErrorStateProps) {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? "dark"];

  return (
    <View
      style={[
        styles.container,
        {
          borderColor: theme.danger,
          backgroundColor: "rgba(214, 69, 69, 0.12)",
        },
      ]}
    >
      <Text style={[styles.message, { color: theme.danger }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  message: {
    fontSize: 13,
    lineHeight: 18,
  },
});
