/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from "react-native";

const shared = {
  // Accents — identical in both modes
  electricBlue: "#2C6BED",
  violet: "#8B7CFF",

  // Functional — identical in both modes
  success: "#1C9C61",
  danger: "#D64545",
  warning: "#F2B705",
};

export const Colors = {
  dark: {
    ...shared,

    // Backgrounds
    background: "#0B0F1A", // Deep Navy — main background
    surface: "#1A2133", // Soft Slate — cards, modals, inputs

    // Text
    textPrimary: "#FFFFFF",
    textSecondary: "#A0A7B8",
    textDisabled: "#5A6275",

    // Input / form
    inputBackground: "#1A2133",
    inputBorder: "#2A3347",
    inputFocusBorder: "#2C6BED",
  },
  light: {
    ...shared,

    // Backgrounds
    background: "#F4F6FA", // Off-white — main background
    surface: "#FFFFFF", // White — cards, modals, inputs

    // Text
    textPrimary: "#0B0F1A", // Deep Navy on light
    textSecondary: "#5A6275",
    textDisabled: "#A0A7B8",

    // Input / form
    inputBackground: "#FFFFFF",
    inputBorder: "#D0D5E0",
    inputFocusBorder: "#2C6BED",
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export type ColorScheme = keyof typeof Colors;
export type ThemeColors = typeof Colors.dark;
