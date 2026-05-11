import { IconSymbol } from "@/components/shared/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

interface HeaderNavProps {
  iconName: "close" | "add";
  navPath: string;
}

export const HeaderNav = ({ iconName, navPath }: HeaderNavProps) => {
  const theme = Colors[useColorScheme()];
  const routeToPath = () => {
    router.replace(navPath);
  };

  return (
    <View>
      <Pressable
        onPress={routeToPath}
        hitSlop={12}
        accessibilityRole="button"
        accessibilityLabel="Navigate To Agent Forge"
      >
        <View style={styles.container}>
          <IconSymbol size={20} name={iconName} color={theme.textPrimary} />
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 15, paddingVertical: 15 },
  logo: {
    width: 50,
    height: 50,
  },
});
