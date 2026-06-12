import { EducationalTooltip } from "@/components/ui/EducationalTooltip";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface ForgeOptionCardProps {
  label: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  disabledReason?: string;
  icon?: React.ReactNode;
}

export function ForgeOptionCard({
  label,
  description,
  selected,
  onSelect,
  disabled = false,
  disabledReason,
  icon,
}: ForgeOptionCardProps) {
  const theme = Colors[useColorScheme()];

  const cardContent = (
    <View
      style={[
        styles.card,
        selected
          ? {
              borderColor: theme.electricBlue,
              backgroundColor: "rgba(44,107,237,0.1)",
            }
          : {
              borderColor: theme.textDisabled,
              backgroundColor: theme.surface,
            },
        disabled && styles.cardDisabled,
      ]}
    >
      {icon && <View style={styles.iconSlot}>{icon}</View>}
      <View style={styles.textStack}>
        <Text
          style={[
            styles.label,
            { color: theme.textPrimary },
            disabled && { color: theme.textDisabled },
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            styles.description,
            { color: theme.textSecondary },
            disabled && { color: theme.textDisabled },
          ]}
        >
          {description}
        </Text>
      </View>
    </View>
  );

  if (disabled && disabledReason) {
    return (
      <View style={styles.pressable}>
        <EducationalTooltip
          title="Not available"
          body={disabledReason}
          trigger={cardContent}
        />
      </View>
    );
  }

  return (
    <Pressable
      onPress={disabled ? undefined : onSelect}
      style={styles.pressable}
    >
      {cardContent}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    minHeight: 44,
  },
  card: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  iconSlot: {
    alignItems: "center",
    justifyContent: "center",
  },
  textStack: {
    flex: 1,
    gap: 4,
  },
  cardDisabled: {
    opacity: 0.4,
  },
  label: {
    fontSize: 15,
    fontWeight: "500",
  },
  description: {
    fontSize: 13,
  },
});
