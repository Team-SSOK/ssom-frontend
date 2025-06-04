import React from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

interface LoginInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  iconName: keyof typeof Ionicons.glyphMap;
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  onTogglePassword?: () => void;
  editable?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export default function LoginInput({
  value,
  onChangeText,
  placeholder,
  iconName,
  secureTextEntry = false,
  showPasswordToggle = false,
  onTogglePassword,
  editable = true,
  autoCapitalize = 'none',
}: LoginInputProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.inputContainer}>
      <View style={[styles.inputWrapper, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Ionicons name={iconName} size={20} color={colors.textMuted} />
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          editable={editable}
        />
        {showPasswordToggle && onTogglePassword && (
          <Pressable onPress={onTogglePassword} style={styles.eyeButton}>
            <Ionicons
              name={secureTextEntry ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  eyeButton: {
    padding: 4,
  },
}); 