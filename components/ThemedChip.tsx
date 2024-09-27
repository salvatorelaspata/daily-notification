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
  isCard?: boolean;
};

export function ThemedChip({
  text,
  lightColor,
  darkColor,
  style,
  selected = false,
  isCard = false,
  ...rest
}: ThemedChipProps) {
  let bgColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );
  let textColor = useThemeColor({ light: darkColor, dark: lightColor }, "text");

  if (isCard) {
    bgColor = useThemeColor({ light: lightColor, dark: darkColor }, "card");
    textColor = useThemeColor(
      { light: darkColor, dark: lightColor },
      "cardText"
    );
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: !selected ? "transparent" : textColor,
          borderColor: !selected ? textColor : "transparent",
          borderWidth: 1,
        },
        style,
      ]}
      {...rest}
    >
      <Text
        style={[styles.buttonText, { color: !selected ? textColor : bgColor }]}
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
