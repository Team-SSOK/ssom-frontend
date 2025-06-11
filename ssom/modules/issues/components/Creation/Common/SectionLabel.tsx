import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

interface SectionLabelProps {
  text: string;
  required?: boolean;
}

export default function SectionLabel({ text, required = false }: SectionLabelProps) {
  const { colors } = useTheme();

  return (
    <Text style={[styles.label, { color: colors.text }]}>
      {text}
      {required && (
        <Text style={[styles.required, { color: colors.critical }]}> *</Text>
      )}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  required: {
    fontSize: 16,
  },
}); 