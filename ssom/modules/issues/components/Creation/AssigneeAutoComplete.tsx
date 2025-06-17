import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { authApi, User } from '@/modules/auth/apis/authApi';
import { LoadingIndicator } from '@/components';
import { Ionicons } from '@expo/vector-icons';

interface AssigneeAutoCompleteProps {
  label: string;
  selectedAssignees: string[];
  onAddAssignee: (assignee: string) => void;
  onRemoveAssignee: (assignee: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

export default function AssigneeAutoComplete({
  label,
  selectedAssignees,
  onAddAssignee,
  onRemoveAssignee,
  placeholder,
  error,
  disabled = false,
}: AssigneeAutoCompleteProps) {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const userList = await authApi.getUserList();
        setAllUsers(userList);
      } catch (e) {
        if (__DEV__) console.error('Failed to fetch users:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers([]);
      return;
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    const availableUsers = allUsers.filter(
      (user) => !selectedAssignees.includes(user.username)
    );
    const filtered = availableUsers.filter(
      (user) =>
        user.username.toLowerCase().includes(lowerCaseQuery) ||
        user.id.toLowerCase().includes(lowerCaseQuery)
    );
    setFilteredUsers(filtered);
  }, [searchQuery, allUsers, selectedAssignees]);

  const handleSelectUser = (user: User) => {
    onAddAssignee(user.username);
    setSearchQuery('');
    setFilteredUsers([]);
    inputRef.current?.blur();
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={[styles.inputContainer, { borderColor: error ? colors.critical : colors.border }]}>
        <View style={styles.chipsContainer}>
          {selectedAssignees.map((assignee) => (
            <View key={assignee} style={[styles.chip, { backgroundColor: colors.primary }]}>
              <Text style={styles.chipText}>{assignee}</Text>
              <Pressable onPress={() => onRemoveAssignee(assignee)} style={styles.chipRemove}>
                <Ionicons name="close" size={14} color="white" />
              </Pressable>
            </View>
          ))}
        </View>
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: colors.text }]}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={selectedAssignees.length === 0 ? placeholder : '추가 담당자 검색...'}
          placeholderTextColor={colors.textSecondary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          editable={!disabled}
        />
      </View>

      {error && <Text style={[styles.errorText, { color: colors.critical }]}>{error}</Text>}
      
      {isFocused && filteredUsers.length > 0 && (
        <View style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <ScrollView keyboardShouldPersistTaps="handled">
            {filteredUsers.map((user) => (
              <Pressable key={user.id} style={styles.userItem} onPress={() => handleSelectUser(user)}>
                <Text style={{ color: colors.text }}>{user.username}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                  {user.id} • {user.department}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 8 },
  inputContainer: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 12 },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingTop: 8, gap: 8 },
  chip: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16 },
  chipText: { color: 'white', fontWeight: '500' },
  chipRemove: { marginLeft: 6, padding: 2 },
  input: { height: 48, fontSize: 16 },
  errorText: { color: 'red', marginTop: 4 },
  dropdown: { maxHeight: 150, borderWidth: 1, borderRadius: 8, marginTop: 4 },
  userItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
}); 