import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedChipProps = TouchableOpacityProps & {
  text: string;
  // style the chip with the light and dark color
  style?: ViewStyle;
  lightColor?: string;
  darkColor?: string;
  selected?: boolean;
};

export function ThemedChip({
  text,
  lightColor,
  darkColor,
  style,
  selected = false,
  ...rest
}: ThemedChipProps) {
  const bgColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "buttonBg"
  );
  const textColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "buttonText"
  );

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: !selected ? "transparent" : bgColor,
          borderColor: !selected ? bgColor : "transparent",
          borderWidth: 1,
        },
        style,
      ]}
      {...rest}
    >
      <Text
        style={[styles.buttonText, { color: !selected ? bgColor : textColor }]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    margin: 6,
  },
  buttonText: {
    fontWeight: "500",
  },
});
