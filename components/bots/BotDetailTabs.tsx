import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export type TabName = "Overview" | "Performance" | "Configuration" | "Brain";

const TABS: TabName[] = ["Overview", "Performance", "Configuration", "Brain"];

interface Props {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
}

export function BotDetailTabs({ activeTab, onTabChange }: Props) {
  const theme = Colors[useColorScheme()];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.surface, borderBottomColor: theme.inputBorder },
      ]}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {TABS.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <Pressable
              key={tab}
              onPress={() => onTabChange(tab)}
              style={styles.tab}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: isActive ? theme.textPrimary : theme.textSecondary },
                  isActive && styles.tabTextActive,
                ]}
              >
                {tab}
              </Text>
              {isActive && (
                <View
                  style={[
                    styles.activeUnderline,
                    { backgroundColor: theme.electricBlue },
                  ]}
                />
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
  scrollContent: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  tab: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 10,
    alignItems: "center",
    position: "relative",
    minWidth: 44,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  tabTextActive: {
    fontWeight: "600",
  },
  activeUnderline: {
    position: "absolute",
    bottom: 0,
    left: 12,
    right: 12,
    height: 2,
    borderRadius: 1,
  },
});
