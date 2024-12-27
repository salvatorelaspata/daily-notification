import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import { TextInput, StyleSheet, TextInputProps, TextStyle } from "react-native";
interface ThemedTextInputProps extends TextInputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  style?: TextStyle;
}

const ThemedTextInput: React.FC<ThemedTextInputProps> = ({
  placeholder,
  value,
  onChangeText,
  style,
  ...rest
}) => {
  const placeholderTextcolor = useThemeColor({}, "placeholderTextColor");
  const textColor = useThemeColor({}, "text");
  return (
    <TextInput
      placeholderTextColor={placeholderTextcolor}
      style={[
        styles.input,
        { color: textColor, borderColor: textColor },
        style,
      ]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      {...rest}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
});

export default ThemedTextInput;
