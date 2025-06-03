import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSession } from '@/ctx/useSession';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PasswordChange() {
  const { session } = useSession();
  const { isDark } = useTheme();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if this is the user's first login
    const checkFirstLogin = async () => {
      try {
        const hasChangedPassword = await AsyncStorage.getItem('hasChangedPassword');
        setIsFirstLogin(!hasChangedPassword);
        
        // If not first login, redirect to main dashboard
        if (hasChangedPassword) {
          router.replace('/(app)/(tabs)');
        }
      } catch (error) {
        console.error('Error checking first login status:', error);
        setIsFirstLogin(false);
      }
    };

    checkFirstLogin();
  }, []);

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    try {
      // Mock API call - replace with actual password change API
      // await authApi.changePassword({
      //   currentPassword,
      //   newPassword
      // });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mark that password has been changed
      await AsyncStorage.setItem('hasChangedPassword', 'true');
      
      Alert.alert(
        'Success', 
        'Password changed successfully! You will now be redirected to the main app.',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(app)/(tabs)')
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking first login status
  if (isFirstLogin === null) {
    return (
      <SafeAreaView 
        style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
      >
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: isDark ? '#fff' : '#000' }]}>
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView 
      style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
            Welcome to SSOM
          </Text>
          <Text style={[styles.subtitle, { color: isDark ? '#ccc' : '#666' }]}>
            For security reasons, please change your initial password
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>
              Current Password
            </Text>
            <View style={[
              styles.passwordContainer,
              { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }
            ]}>
              <TextInput
                style={[styles.passwordInput, { color: isDark ? '#fff' : '#000' }]}
                value={currentPassword}
                onChangeText={setCurrentPassword}
                placeholder="Enter current password"
                placeholderTextColor={isDark ? '#888' : '#999'}
                secureTextEntry={!showCurrentPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                style={styles.eyeButton}
              >
                <Ionicons 
                  name={showCurrentPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color={isDark ? '#888' : '#999'} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>
              New Password
            </Text>
            <View style={[
              styles.passwordContainer,
              { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }
            ]}>
              <TextInput
                style={[styles.passwordInput, { color: isDark ? '#fff' : '#000' }]}
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder="Enter new password (min 8 characters)"
                placeholderTextColor={isDark ? '#888' : '#999'}
                secureTextEntry={!showNewPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowNewPassword(!showNewPassword)}
                style={styles.eyeButton}
              >
                <Ionicons 
                  name={showNewPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color={isDark ? '#888' : '#999'} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>
              Confirm New Password
            </Text>
            <View style={[
              styles.passwordContainer,
              { backgroundColor: isDark ? '#1a1a1a' : '#f5f5f5' }
            ]}>
              <TextInput
                style={[styles.passwordInput, { color: isDark ? '#fff' : '#000' }]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm new password"
                placeholderTextColor={isDark ? '#888' : '#999'}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeButton}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color={isDark ? '#888' : '#999'} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <Button
            title={loading ? "Changing Password..." : "Change Password"}
            onPress={handlePasswordChange}
            disabled={loading}
            style={styles.changeButton}
          />
        </View>

        <View style={styles.requirements}>
          <Text style={[styles.requirementsTitle, { color: isDark ? '#fff' : '#000' }]}>
            Password Requirements:
          </Text>
          <Text style={[styles.requirementItem, { color: isDark ? '#ccc' : '#666' }]}>
            • At least 8 characters long
          </Text>
          <Text style={[styles.requirementItem, { color: isDark ? '#ccc' : '#666' }]}>
            • Contains both uppercase and lowercase letters
          </Text>
          <Text style={[styles.requirementItem, { color: isDark ? '#ccc' : '#666' }]}>
            • Contains at least one number
          </Text>
          <Text style={[styles.requirementItem, { color: isDark ? '#ccc' : '#666' }]}>
            • Contains at least one special character
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  eyeButton: {
    padding: 8,
  },
  changeButton: {
    marginTop: 12,
  },
  requirements: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  requirementItem: {
    fontSize: 14,
    marginBottom: 4,
  },
});
