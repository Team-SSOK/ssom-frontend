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

interface AssigneeAutoCompleteProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  label?: string;
  required?: boolean;
}

export default function AssigneeAutoComplete({
  value,
  onChangeText,
  placeholder,
  error,
  disabled = false,
  label,
  required = false,
}: AssigneeAutoCompleteProps) {
  const { colors } = useTheme();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // 사용자 목록 로드
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const userList = await authApi.getUserList();
        setUsers(userList);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 입력값에 따라 사용자 필터링
  useEffect(() => {
    if (!value.trim()) {
      setFilteredUsers([]);
      setShowDropdown(false);
      return;
    }

    const searchTerm = value.toLowerCase();
    const filtered = users.filter((user) => {
      const username = user.username.toLowerCase();
      const id = user.id.toLowerCase();
      const department = user.department.toLowerCase();
      
      return (
        username.includes(searchTerm) ||
        id.includes(searchTerm) ||
        department.includes(searchTerm) ||
        // 한글 초성 검색 지원
        getInitialConsonants(user.username).includes(searchTerm)
      );
    });

    setFilteredUsers(filtered);
    setShowDropdown(filtered.length > 0 && inputFocused);
  }, [value, users, inputFocused]);

  // 한글 초성 추출 함수
  const getInitialConsonants = (text: string): string => {
    const consonants = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ';
    return text
      .split('')
      .map((char) => {
        const code = char.charCodeAt(0) - 44032;
        if (code >= 0 && code <= 11171) {
          return consonants[Math.floor(code / 588)];
        }
        return char;
      })
      .join('');
  };

  const handleUserSelect = (user: User) => {
    onChangeText(user.username);
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  const handleFocus = () => {
    setInputFocused(true);
    if (value.trim() && filteredUsers.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleBlur = () => {
    setInputFocused(false);
    // 약간의 지연을 두어 사용자가 드롭다운 아이템을 클릭할 수 있게 함
    setTimeout(() => setShowDropdown(false), 200);
  };

  const renderUserItem = (item: User, index: number) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.userItem, 
        { borderBottomColor: colors.border },
        index === filteredUsers.length - 1 && { borderBottomWidth: 0 }
      ]}
      onPress={() => handleUserSelect(item)}
      activeOpacity={0.7}
    >
      <View style={styles.userInfo}>
        <Text style={[styles.username, { color: colors.text }]}>
          {item.username}
        </Text>
        <Text style={[styles.userDetails, { color: colors.textSecondary }]}>
          {item.id} • {item.department}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: colors.text }]}>
            {label}
            {required && <Text style={[styles.required, { color: colors.critical }]}> *</Text>}
          </Text>
        </View>
      )}
      
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            {
              backgroundColor: colors.card,
              borderColor: error ? colors.critical : colors.border,
              color: colors.text,
            },
            disabled && { opacity: 0.5 },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
        />
        
        {isLoading && (
          <View style={styles.loadingContainer}>
            <LoadingIndicator size="small" fullScreen={false} />
          </View>
        )}
      </View>

      {error && (
        <Text style={[styles.errorText, { color: colors.critical }]}>
          {error}
        </Text>
      )}

      {showDropdown && (
        <View
          style={[
            styles.dropdown,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              shadowColor: colors.text,
            },
          ]}
        >
          <ScrollView
            style={styles.userList}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled={true}
          >
            {filteredUsers.map((item, index) => renderUserItem(item, index))}
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    zIndex: 1000,
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  required: {
    fontSize: 16,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 48,
  },
  loadingContainer: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  userList: {
    maxHeight: 200,
  },
  userItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  userDetails: {
    fontSize: 12,
    lineHeight: 16,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 16,
  },
}); 