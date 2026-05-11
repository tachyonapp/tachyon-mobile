import { type ThemeColors } from "@/constants/theme";
import { StyleSheet, Text, View } from "react-native";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  theme: ThemeColors;
}

export const Section = ({ title, children, theme }: SectionProps) => {
  return (
    <View style={[styles.section, { backgroundColor: theme.surface }]}>
      <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>
        {title}
      </Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    borderRadius: 12,
    padding: 16,
    gap: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
});
