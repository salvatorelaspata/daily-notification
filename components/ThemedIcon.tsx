import { Ionicons } from "@expo/vector-icons";

import { useThemeColor } from "@/hooks/useThemeColor";
import type { StyleProp, TextStyle } from "react-native";

export type ThemedIconProps = {
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
  lightColor?: string;
  darkColor?: string;
  isCard?: boolean;
  style?: StyleProp<TextStyle>;
};

export function ThemedIcon({
  icon,
  size = 16,
  lightColor,
  darkColor,
  isCard = false,
  style,
}: ThemedIconProps) {
  const text = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const textCard = useThemeColor(
    { light: lightColor, dark: darkColor },
    "icon"
  );

  return (
    <Ionicons
      name={icon}
      size={size}
      color={isCard ? textCard : text}
      style={style}
    />
  );
}
