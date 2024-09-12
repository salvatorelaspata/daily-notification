import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  selected?: boolean;
  style?: object;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  selected = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, selected && styles.buttonSelected, style]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, selected && styles.buttonTextSelected]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    marginBottom: 8,
  },
  buttonSelected: {
    backgroundColor: "#007AFF",
  },
  buttonText: {
    color: "#000000",
    fontWeight: "500",
  },
  buttonTextSelected: {
    color: "#ffffff",
  },
});

export default CustomButton;
