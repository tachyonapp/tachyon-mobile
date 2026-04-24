// Fallback for using Material Icons on Android and web.

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight } from "expo-symbols";
import { type ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type MaterialIconName = ComponentProps<typeof MaterialIcons>["name"];
type MaterialCommunityIconName = ComponentProps<
  typeof MaterialCommunityIcons
>["name"];

/**
 * SF Symbol name → MaterialIcons name.
 * Used for icons that have a direct Material Icons equivalent.
 */
const MATERIAL_MAPPING = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.left": "chevron-left",
  "chevron.up": "expand-less",
  "chevron.down": "expand-more",
  "info.circle": "info-outline",
  "gearshape.fill": "settings",
  xmark: "close",
  checkmark: "check",
} as const satisfies Record<string, MaterialIconName>;

/**
 * SF Symbol name → MaterialCommunityIcons name.
 * Used for icons with no Material Icons equivalent.
 */
const COMMUNITY_MAPPING = {
  "robot-outline": "robot-outline",
} as const satisfies Record<string, MaterialCommunityIconName>;

type IconSymbolName =
  | keyof typeof MATERIAL_MAPPING
  | keyof typeof COMMUNITY_MAPPING;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * Icon `name`s are based on SF Symbols and require manual mapping to a Material icon.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  if (name in COMMUNITY_MAPPING) {
    return (
      <MaterialCommunityIcons
        color={color}
        size={size}
        name={COMMUNITY_MAPPING[name as keyof typeof COMMUNITY_MAPPING]}
        style={style}
      />
    );
  }

  return (
    <MaterialIcons
      color={color}
      size={size}
      name={MATERIAL_MAPPING[name as keyof typeof MATERIAL_MAPPING]}
      style={style}
    />
  );
}
