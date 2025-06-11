import { useCallback } from 'react';
import Toast from 'react-native-toast-message';

export interface ToastProps {
  title: string;
  message?: string;
  duration?: number;
  onPress?: () => void;
  onHide?: () => void;
}

type ToastType = 'success' | 'error' | 'info' | 'warning';

// Configuration for different toast types
const TOAST_CONFIG: Record<ToastType, { defaultDuration: number }> = {
  success: { defaultDuration: 3000 },
  error: { defaultDuration: 4000 },
  info: { defaultDuration: 3000 },
  warning: { defaultDuration: 3500 },
};

export const useToast = () => {
  // Common toast method that handles all types
  const showToast = useCallback((type: ToastType, props: ToastProps) => {
    const config = TOAST_CONFIG[type];
    
    Toast.show({
      type,
      text1: props.title,
      text2: props.message,
      visibilityTime: props.duration || config.defaultDuration,
      onPress: props.onPress,
      onHide: props.onHide,
    });
  }, []);

  // Type-specific methods using the common showToast
  const showSuccess = useCallback((props: ToastProps) => {
    showToast('success', props);
  }, [showToast]);

  const showError = useCallback((props: ToastProps) => {
    showToast('error', props);
  }, [showToast]);

  const showInfo = useCallback((props: ToastProps) => {
    showToast('info', props);
  }, [showToast]);

  const showWarning = useCallback((props: ToastProps) => {
    showToast('warning', props);
  }, [showToast]);

  const hide = useCallback(() => {
    Toast.hide();
  }, []);

  // Simplified methods for common use cases
  const success = useCallback((title: string, message?: string) => {
    showToast('success', { title, message });
  }, [showToast]);

  const error = useCallback((title: string, message?: string) => {
    showToast('error', { title, message });
  }, [showToast]);

  const info = useCallback((title: string, message?: string) => {
    showToast('info', { title, message });
  }, [showToast]);

  const warning = useCallback((title: string, message?: string) => {
    showToast('warning', { title, message });
  }, [showToast]);

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