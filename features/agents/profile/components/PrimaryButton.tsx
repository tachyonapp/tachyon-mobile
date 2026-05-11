import { type ThemeColors } from "@/constants/theme";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  theme: ThemeColors;
}

export const PrimaryButton = ({
  label,
  onPress,
  theme,
}: PrimaryButtonProps) => {
  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: theme.electricBlue }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.buttonText, { color: "#FFFFFF" }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
