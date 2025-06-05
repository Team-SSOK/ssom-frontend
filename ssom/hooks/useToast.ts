import { useCallback } from 'react';
import Toast from 'react-native-toast-message';

export interface ToastProps {
  title: string;
  message?: string;
  duration?: number;
  onPress?: () => void;
  onHide?: () => void;
}

export const useToast = () => {
  const showSuccess = useCallback((props: ToastProps) => {
    Toast.show({
      type: 'success',
      text1: props.title,
      text2: props.message,
      visibilityTime: props.duration || 3000,
      onPress: props.onPress,
      onHide: props.onHide,
    });
  }, []);

  const showError = useCallback((props: ToastProps) => {
    Toast.show({
      type: 'error',
      text1: props.title,
      text2: props.message,
      visibilityTime: props.duration || 4000,
      onPress: props.onPress,
      onHide: props.onHide,
    });
  }, []);

  const showInfo = useCallback((props: ToastProps) => {
    Toast.show({
      type: 'info',
      text1: props.title,
      text2: props.message,
      visibilityTime: props.duration || 3000,
      onPress: props.onPress,
      onHide: props.onHide,
    });
  }, []);

  const showWarning = useCallback((props: ToastProps) => {
    Toast.show({
      type: 'warning',
      text1: props.title,
      text2: props.message,
      visibilityTime: props.duration || 3500,
      onPress: props.onPress,
      onHide: props.onHide,
    });
  }, []);

  const hide = useCallback(() => {
    Toast.hide();
  }, []);

  // Simplified methods for common use cases
  const success = useCallback((title: string, message?: string) => {
    showSuccess({ title, message });
  }, [showSuccess]);

  const error = useCallback((title: string, message?: string) => {
    showError({ title, message });
  }, [showError]);

  const info = useCallback((title: string, message?: string) => {
    showInfo({ title, message });
  }, [showInfo]);

  const warning = useCallback((title: string, message?: string) => {
    showWarning({ title, message });
  }, [showWarning]);

  return {
    // Full control methods
    showSuccess,
    showError,
    showInfo,
    showWarning,
    hide,
    
    // Simplified methods
    success,
    error,
    info,
    warning,
  };
}; 