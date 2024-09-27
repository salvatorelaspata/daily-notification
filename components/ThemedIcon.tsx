import { Ionicons } from "@expo/vector-icons";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedIconProps = {
  icon: keyof typeof Ionicons.glyphMap;
  size?: number;
  lightColor?: string;
  darkColor?: string;
  isCard?: boolean;
};

export function ThemedIcon({
  icon,
  size = 16,
  lightColor,
  darkColor,
  isCard = false,
}: ThemedIconProps) {
  const text = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const textCard = useThemeColor(
    { light: lightColor, dark: darkColor },
    "cardText"
  );

  return <Ionicons name={icon} size={size} color={isCard ? textCard : text} />;
}
