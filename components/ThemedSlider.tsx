import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import Slider, { SliderProps } from "@react-native-community/slider";

export type ThemedSliderProps = SliderProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedSlider({
  lightColor,
  darkColor,
  ...rest
}: ThemedSliderProps) {
  const thumbTintColor = useThemeColor({}, "thumbTint");
  const minimumTrackTintColor = useThemeColor({}, "minimumTrackTint");
  const maximumTrackTintColor = useThemeColor({}, "maximumTrackTint");

  return (
    <Slider
      style={styles.slider}
      thumbTintColor={thumbTintColor}
      minimumTrackTintColor={minimumTrackTintColor}
      maximumTrackTintColor={maximumTrackTintColor}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  slider: {
    width: "100%",
    height: 40,
  },
});
