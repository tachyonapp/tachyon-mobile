import { HeaderNav } from "@/components/layout/header-nav";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Slot } from "expo-router";
import { SafeAreaView, StyleSheet, View } from "react-native";

export default function Layout() {
  const theme = Colors[useColorScheme()];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <HeaderNav navPath="/(tabs)/feed" iconName="close" />

      <View style={styles.content}>
        <Slot />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flex: 1 },
});
