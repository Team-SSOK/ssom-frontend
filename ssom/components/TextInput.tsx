import React, { useState, forwardRef } from "react";
import {
  View,
  TextInput as RNTextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInputProps as RNTextInputProps,
  ViewStyle,
  TextStyle,
} from "react-native";

interface TextInputProps extends Omit<RNTextInputProps, "style"> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPassword?: boolean;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  required?: boolean;
}

const TextInput = forwardRef<RNTextInput, TextInputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      isPassword = false,
      containerStyle,
      inputStyle,
      labelStyle,
      errorStyle,
      required = false,
      ...props
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const hasError = Boolean(error);
    const hasValue = Boolean(props.value);

    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible);
    };

    const handleFocus = (e: any) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: any) => {
      setIsFocused(false);
      props.onBlur?.(e);
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {label && (
          <View style={styles.labelContainer}>
            <Text style={[styles.label, labelStyle]}>
              {label}
              {required && <Text style={styles.required}> *</Text>}
            </Text>
          </View>
        )}

        <View
          style={[
            styles.inputContainer,
            isFocused && styles.inputContainerFocused,
            hasError && styles.inputContainerError,
          ]}
        >
          {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

          <RNTextInput
            ref={ref}
            style={[
              styles.input,
              ...(leftIcon ? [styles.inputWithLeftIcon] : []),
              ...(rightIcon || isPassword ? [styles.inputWithRightIcon] : []),
              ...(inputStyle ? [inputStyle] : []),
            ]}
            secureTextEntry={isPassword && !isPasswordVisible}
            placeholderTextColor="#8E8E93"
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />

          {isPassword && (
            <TouchableOpacity
              style={styles.rightIconContainer}
              onPress={togglePasswordVisibility}
              accessibilityRole="button"
              accessibilityLabel={isPasswordVisible ? "비밀번호 숨기기" : "비밀번호 보기"}
            >
              <Text style={styles.passwordToggle}>{isPasswordVisible ? "🙈" : "👁️"}</Text>
            </TouchableOpacity>
          )}

          {rightIcon && !isPassword && <View style={styles.rightIconContainer}>{rightIcon}</View>}
        </View>

        {(error || hint) && (
          <View style={styles.messageContainer}>
            <Text style={[hasError ? styles.errorText : styles.hintText, errorStyle]}>{error || hint}</Text>
          </View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    lineHeight: 20,
  },
  required: {
    color: "#FF3B30",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "transparent",
    minHeight: 48,
    paddingHorizontal: 16,
  },
  inputContainerFocused: {
    borderColor: "#007AFF",
    backgroundColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowColor: "#007AFF",
    elevation: 3,
  },
  inputContainerError: {
    borderColor: "#FF3B30",
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1C1C1E",
    paddingVertical: 12,
    lineHeight: 20,
  },
  inputWithLeftIcon: {
    marginLeft: 8,
  },
  inputWithRightIcon: {
    marginRight: 8,
  },
  leftIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 20,
    height: 20,
  },
  rightIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 24,
    height: 24,
  },
  passwordToggle: {
    fontSize: 16,
  },
  messageContainer: {
    marginTop: 6,
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 14,
    color: "#FF3B30",
    lineHeight: 16,
  },
  hintText: {
    fontSize: 14,
    color: "#8E8E93",
    lineHeight: 16,
  },
});

TextInput.displayName = "TextInput";

export default TextInput;
