import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";

interface CustomCheckBoxProps {
  label: string;
  checked: boolean;
  onPress: () => void;
  style?: object;
}

const CustomCheckBox: React.FC<CustomCheckBoxProps> = ({
  label,
  checked,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <View style={[styles.checkbox, checked && styles.checked]} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

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

export default CustomCheckBox;
