import { useThemeColor } from "@/hooks/useThemeColor";
import SegmentedControl, {
  SegmentedControlProps,
} from "@react-native-segmented-control/segmented-control";

export type ThemedSegmentedButtonProps = SegmentedControlProps & {
  lightColor?: string;
  darkColor?: string;
  defaultColor?: boolean;
};

export function ThemedSegmentedButton({
  style,
  lightColor,
  darkColor,
  defaultColor = false,
  ...otherProps
}: ThemedSegmentedButtonProps) {
  const segmentedBg = useThemeColor({}, "segmentedBg");
  const segmentedText = useThemeColor({}, "segmentedText");
  const segmentedSelect = useThemeColor({}, "segmentedSelect");
  const segmentedSelectText = useThemeColor({}, "segmentedSelectText");
  const segmentedBorder = useThemeColor({}, "segmentedBorder");

  return (
    <SegmentedControl
      backgroundColor={!defaultColor ? segmentedBg : undefined}
      tintColor={!defaultColor ? segmentedSelect : undefined}
      activeFontStyle={{
        color: !defaultColor ? segmentedSelectText : undefined,
        fontSize: 16,
        fontWeight: "bold",
      }}
      fontStyle={{
        color: !defaultColor ? segmentedText : undefined,
        fontSize: 14,
      }}
      style={[
        !defaultColor && {
          borderColor: segmentedBorder,
          shadowColor: segmentedSelect,
          borderWidth: 1,
        },
        style,
      ]}
      {...otherProps}
    />
  );
}
