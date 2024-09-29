import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedChipProps = TouchableOpacityProps & {
  text: string;
  // style the chip with the light and dark color
  style?: ViewStyle;
  styleText?: TextStyle;
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
  styleText,
  selected = false,
  isCard = false,
  ...rest
}: ThemedChipProps) {
  let bgColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  if (isCard)
    bgColor = useThemeColor({ light: lightColor, dark: darkColor }, "card");

  let textColor = useThemeColor({ light: darkColor, dark: lightColor }, "text");

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: !selected ? bgColor : textColor,
          borderColor: !selected ? textColor : bgColor,
          borderWidth: 1,
        },
        style,
      ]}
      {...rest}
    >
      <Text
        style={[
          styles.buttonText,
          { color: !selected ? textColor : bgColor },
          styleText,
        ]}
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
