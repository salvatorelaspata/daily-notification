import { useThemeColor } from "@/hooks/useThemeColor";
import { ScrollView, ScrollViewProps } from "react-native";

export type ThemedScrollViewProps = ScrollViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedScrollView({
  style,
  lightColor,
  darkColor,
  ...otherProps
}: ThemedScrollViewProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <ScrollView style={[{ backgroundColor }, style]} {...otherProps} />;
}
