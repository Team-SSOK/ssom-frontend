import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { FontFamily } from '@/styles/fonts';

interface PwChangeInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry: boolean;
  onToggleVisibility: () => void;
  error?: string;
  editable?: boolean;
}

export default function PwChangeInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  onToggleVisibility,
  error,
  editable = true,
}: PwChangeInputProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: colors.text }]}>
        {label}
      </Text>
      <View style={[
        styles.passwordContainer,
        { 
          backgroundColor: colors.card, 
          borderColor: error ? colors.critical : colors.border 
        }
      ]}>
        <Ionicons name="lock-closed-outline" size={20} color={colors.textMuted} />
        <TextInput
          style={[styles.passwordInput, { color: colors.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          secureTextEntry={secureTextEntry}
          autoCapitalize="none"
          autoCorrect={false}
          editable={editable}
        />
        <Pressable
          onPress={onToggleVisibility}
          style={styles.eyeButton}
        >
          <Ionicons 
            name={secureTextEntry ? "eye-off-outline" : "eye-outline"} 
            size={20} 
            color={colors.textMuted} 
          />
        </Pressable>
      </View>
      {error && (
        <Text style={[styles.errorText, { color: colors.critical }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: FontFamily.semiBold,
    fontWeight: '600',
    marginBottom: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    height: 56,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: FontFamily.regular,
    fontWeight: '400',
    marginLeft: 12,
  },
  eyeButton: {
    padding: 4,
  },
  errorText: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    fontWeight: '400',
    marginTop: 4,
  },
}); 