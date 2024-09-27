import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedButtonProps = TouchableOpacityProps & {
  text: string;
  lightColor?: string;
  darkColor?: string;
  type?: "default" | "outline";
  isCard?: boolean;
};

export function ThemedButton({
  text,
  lightColor,
  darkColor,
  type = "default",
  isCard = false,
  ...rest
}: ThemedButtonProps) {
  const bgColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    isCard ? "buttonBg" : "text"
  );
  const textColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    isCard ? "buttonText" : "background"
  );

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: type === "outline" ? "transparent" : bgColor,
          borderColor: bgColor,
          borderWidth: type === "outline" ? 1 : 0,
        },
      ]}
      {...rest}
    >
      <Text
        style={[
          styles.buttonText,
          { color: type === "outline" ? bgColor : textColor },
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
    padding: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  buttonText: {
    fontWeight: "500",
  },
});
