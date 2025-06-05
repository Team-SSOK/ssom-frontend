import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, FlatList } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { ServiceInfo } from '@/modules/logging/types';
import { FontFamily } from '@/styles/fonts';
import { Ionicons } from '@expo/vector-icons';

interface LogServiceDropdownProps {
  services: ServiceInfo[];
  selectedService: string;
  onServiceChange: (service: string) => void;
  isLoading?: boolean;
}

export default function LogServiceDropdown({ 
  services, 
  selectedService, 
  onServiceChange,
  isLoading = false 
}: LogServiceDropdownProps) {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const selectedServiceName = selectedService === 'ALL' 
    ? '전체 서비스' 
    : services.find(s => s.serviceName === selectedService)?.serviceName || selectedService;

  const handleServiceSelect = (serviceApp: string) => {
    onServiceChange(serviceApp);
    setIsOpen(false);
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={[
          styles.dropdown,
          { 
            backgroundColor: colors.card,
            borderColor: colors.border,
          }
        ]}
        onPress={() => setIsOpen(true)}
        disabled={isLoading}
      >
        <Text 
          style={[
            styles.dropdownText, 
            { color: colors.text },
            isLoading && { opacity: 0.5 }
          ]}
          numberOfLines={1}
        >
          {selectedServiceName}
        </Text>
        <Ionicons 
          name="chevron-down" 
          size={20} 
          color={colors.textMuted} 
        />
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setIsOpen(false)}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <FlatList
              data={[
                { serviceName: 'ALL', count: 0, displayName: '전체 서비스' },
                ...services.map(service => ({ 
                  ...service, 
                  displayName: `${service.serviceName} (${service.count})` 
                }))
              ]}
              keyExtractor={(item) => item.serviceName}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <Pressable
                  style={[
                    styles.optionItem,
                    selectedService === item.serviceName && { 
                      backgroundColor: colors.primary + '15' 
                    }
                  ]}
                  onPress={() => handleServiceSelect(item.serviceName)}
                >
                  <Text 
                    style={[
                      styles.optionText,
                      { color: colors.text },
                      selectedService === item.serviceName && { 
                        color: colors.primary,
                        fontWeight: '600'
                      }
                    ]}
                  >
                    {item.displayName}
                  </Text>
                  {selectedService === item.serviceName && (
                    <Ionicons 
                      name="checkmark" 
                      size={18} 
                      color={colors.primary} 
                    />
                  )}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minWidth: 120,
    maxWidth: 160,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    height: 36,
  },
  dropdownText: {
    fontSize: 14,
    fontFamily: FontFamily.medium,
    fontWeight: '500',
    flex: 1,
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    marginHorizontal: 20,
    borderRadius: 12,
    maxHeight: 300,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  optionText: {
    fontSize: 14,
    fontFamily: FontFamily.regular,
    flex: 1,
  },
}); 