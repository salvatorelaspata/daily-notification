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
};

export function ThemedButton({
  text,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedButtonProps) {
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
