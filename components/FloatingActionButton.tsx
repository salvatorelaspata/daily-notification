import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface FloatingAction {
  text: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

interface FloatingActionButtonProps {
  actions: FloatingAction[];
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  actions,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const animation = useRef(new Animated.Value(0)).current;

  const toggleMenu = (): void => {
    const toValue = isOpen ? 0 : 1;
    Animated.spring(animation, {
      toValue,
      friction: 5,
      useNativeDriver: true,
    }).start();
    setIsOpen(!isOpen);
  };

  const rotation: Animated.AnimatedProps<any> = {
    transform: [
      {
        rotate: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", "45deg"],
        }),
      },
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [1.3, 1],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      {actions.map((action, index) => {
        const actionStyle = {
          transform: [
            { scale: animation },
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -60 * (index + 1)],
              }),
            },
            {
              rotate: animation.interpolate({
                inputRange: [0, 1],
                outputRange: ["0deg", "720deg"],
              }),
            },
          ],
        };

        const actionTextStyle = {
          transform: [
            { scale: animation },
            {
              translateY: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -60 * (index + 1)],
              }),
            },
          ],
        };

        return (
          <TouchableOpacity
            key={index}
            onPress={() => {
              action.onPress();
              toggleMenu();
            }}
            style={styles.actionButton}
          >
            <Animated.View
              style={[
                styles.actionButton,
                { backgroundColor: "#007bff" },
                actionStyle,
              ]}
            >
              <Ionicons name={action.icon} size={24} color="#fff" />
            </Animated.View>
            <Animated.View style={[styles.actionButtonWrap, actionTextStyle]}>
              <Text style={{ ...styles.actionButtonText, color: "#007bff" }}>
                {action.text}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
      <TouchableOpacity
        onPress={toggleMenu}
        style={{ ...styles.button, backgroundColor: "#007bff" }}
      >
        <Animated.View
          style={[styles.button, { backgroundColor: "#007bff" }, rotation]}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 14,
    right: 14,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 5,
  },
  actionButton: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonWrap: {
    position: "absolute",
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    position: "absolute",
    right: 36,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 5,
    borderRadius: 24,
    textAlign: "center",
    padding: 8,
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default FloatingActionButton;
