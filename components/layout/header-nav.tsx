import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

export const HeaderNav = () => {
  const theme = Colors[useColorScheme()];
  const routeToForge = () => {
    router.replace("/(tabs)");
  };

  return (
    <View>
      <Pressable
        onPress={routeToForge}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Navigate Home"
      >
        <View style={styles.logoContainer}>
          <IconSymbol size={20} name="add" color={theme.textPrimary} />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: { paddingHorizontal: 15, paddingVertical: 15 },
  logo: {
    width: 50,
    height: 50,
  },
});
