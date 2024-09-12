import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedText } from "./ThemedText";

export type ThemedCheckboxProps = TouchableOpacityProps & {
  label: string;
  checked: boolean;
  lightColor?: string;
  darkColor?: string;
};

export function ThemedCheckbox({
  label,
  checked,
  lightColor,
  darkColor,
  ...rest
}: ThemedCheckboxProps) {
  const bgColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "buttonBg"
  );
  const textColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "buttonText"
  );

  return (
    <TouchableOpacity style={[styles.container]} {...rest}>
      <View
        style={[
          styles.checkbox,
          { borderColor: bgColor },
          checked && { backgroundColor: bgColor },
        ]}
      />
      <Text style={[styles.label]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#007AFF",
    marginRight: 8,
  },
  checked: {
    backgroundColor: "#007AFF",
  },
  label: {
    fontSize: 16,
  },
});
