import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
  textStyle,
  testID,
}) => {
  const isDisabled = disabled || loading;

  const buttonStyles = [styles.base, styles[variant], styles[size], isDisabled && styles.disabled, style];

  const textStyles = [
    styles.text,
    styles[`${variant}Text`],
    styles[`${size}Text`],
    isDisabled && styles.disabledText,
    textStyle,
  ];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      accessibilityLabel={title}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? "#007AFF" : "#FFFFFF"} size="small" />
      ) : (
        <Text style={textStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Variants
  primary: {
    backgroundColor: "#007AFF",
    shadowColor: "#007AFF",
  },
  secondary: {
    backgroundColor: "#8E8E93",
    shadowColor: "#8E8E93",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#007AFF",
    shadowOpacity: 0,
    elevation: 0,
  },
  danger: {
    backgroundColor: "#FF3B30",
    shadowColor: "#FF3B30",
  },

  // Sizes
  small: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 36,
    borderRadius: 8,
  },
  medium: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 48,
    borderRadius: 12,
  },
  large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 56,
    borderRadius: 14,
  },

  // Disabled state
  disabled: {
    backgroundColor: "#F2F2F7",
    shadowOpacity: 0,
    elevation: 0,
  },

  // Text styles
  text: {
    fontWeight: "600",
    textAlign: "center",
  },
  primaryText: {
    color: "#FFFFFF",
  },
  secondaryText: {
    color: "#FFFFFF",
  },
  outlineText: {
    color: "#007AFF",
  },
  dangerText: {
    color: "#FFFFFF",
  },

  // Text sizes
  smallText: {
    fontSize: 14,
    lineHeight: 16,
  },
  mediumText: {
    fontSize: 16,
    lineHeight: 18,
  },
  largeText: {
    fontSize: 18,
    lineHeight: 20,
  },

  // Disabled text
  disabledText: {
    color: "#8E8E93",
  },
});

export default Button;
