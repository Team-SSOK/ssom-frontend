import React from 'react';
import { StyleSheet } from 'react-native';
import { Portal, Dialog, Text, Button as PaperButton } from 'react-native-paper';
import { useTheme } from '@/hooks/useTheme';

export interface AlertAction {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export interface AlertModalProps {
  visible: boolean;
  title?: string;
  message?: string;
  icon?: string;
  actions?: AlertAction[];
  onDismiss?: () => void;
  dismissable?: boolean;
}

export default function AlertModal({
  visible,
  title,
  message,
  icon,
  actions = [],
  onDismiss,
  dismissable = true,
}: AlertModalProps) {
  const { colors } = useTheme();

  const handleDismiss = () => {
    if (dismissable && onDismiss) {
      onDismiss();
    }
  };

  const handleActionPress = (action: AlertAction) => {
    action.onPress?.();
    if (dismissable && onDismiss) {
      onDismiss();
    }
  };

  const getButtonMode = (style?: string) => {
    switch (style) {
      case 'destructive':
        return 'contained';
      case 'cancel':
        return 'outlined';
      default:
        return 'contained';
    }
  };

  const getButtonColors = (style?: string) => {
    switch (style) {
      case 'destructive':
        return {
          buttonColor: colors.critical,
          textColor: colors.white,
        };
      case 'cancel':
        return {
          buttonColor: 'transparent',
          textColor: colors.textSecondary,
        };
      default:
        return {
          buttonColor: colors.primary,
          textColor: colors.white,
        };
    }
  };

  return (
    <Portal>
      <Dialog
        visible={visible}
        onDismiss={handleDismiss}
        dismissable={dismissable}
        style={[styles.dialog, { backgroundColor: colors.card }]}
      >
        {icon && <Dialog.Icon icon={icon} />}
        
        {title && (
          <Dialog.Title style={[styles.title, { color: colors.text }]}>
            {title}
          </Dialog.Title>
        )}
        
        {message && (
          <Dialog.Content>
            <Text
              variant="bodyMedium"
              style={[styles.message, { color: colors.textSecondary }]}
            >
              {message}
            </Text>
          </Dialog.Content>
        )}
        
        {actions.length > 0 && (
          <Dialog.Actions style={styles.actions}>
            {actions.map((action, index) => {
              const buttonColors = getButtonColors(action.style);
              return (
                <PaperButton
                  key={index}
                  mode={getButtonMode(action.style)}
                  onPress={() => handleActionPress(action)}
                  style={[
                    styles.actionButton,
                    action.style === 'cancel' && {
                      borderColor: colors.border,
                    },
                  ]}
                  labelStyle={styles.actionButtonText}
                  {...buttonColors}
                >
                  {action.text}
                </PaperButton>
              );
            })}
          </Dialog.Actions>
        )}
      </Dialog>
    </Portal>
  );
}

// Hook for easy usage
export function useAlertModal() {
  const [alertState, setAlertState] = React.useState<{
    visible: boolean;
    title?: string;
    message?: string;
    icon?: string;
    actions?: AlertAction[];
    dismissable?: boolean;
  }>({
    visible: false,
    dismissable: true,
  });

  const showAlert = React.useCallback(
    (options: {
      title?: string;
      message?: string;
      icon?: string;
      actions?: AlertAction[];
      dismissable?: boolean;
    }) => {
      setAlertState({
        ...options,
        visible: true,
      });
    },
    []
  );

  const hideAlert = React.useCallback(() => {
    setAlertState((prev) => ({ ...prev, visible: false }));
  }, []);

  // Alert.alert 호환 함수들
  const alert = React.useCallback(
    (
      title: string,
      message?: string,
      buttons?: AlertAction[],
      options?: { cancelable?: boolean }
    ) => {
      const defaultButtons: AlertAction[] = buttons || [
        { text: '확인', style: 'default' },
      ];

      showAlert({
        title,
        message,
        actions: defaultButtons,
        dismissable: options?.cancelable !== false,
      });
    },
    [showAlert]
  );

  const confirm = React.useCallback(
    (
      title: string,
      message?: string,
      onConfirm?: () => void,
      onCancel?: () => void
    ) => {
      showAlert({
        title,
        message,
        actions: [
          { text: '취소', style: 'cancel', onPress: onCancel },
          { text: '확인', style: 'default', onPress: onConfirm },
        ],
      });
    },
    [showAlert]
  );

  const success = React.useCallback(
    (title: string, message?: string, onPress?: () => void) => {
      showAlert({
        title,
        message,
        icon: 'check-circle',
        actions: [{ text: '확인', style: 'default', onPress }],
      });
    },
    [showAlert]
  );

  const error = React.useCallback(
    (title: string, message?: string, onPress?: () => void) => {
      showAlert({
        title,
        message,
        icon: 'alert-circle',
        actions: [{ text: '확인', style: 'destructive', onPress }],
      });
    },
    [showAlert]
  );

  const warning = React.useCallback(
    (title: string, message?: string, onPress?: () => void) => {
      showAlert({
        title,
        message,
        icon: 'alert',
        actions: [{ text: '확인', style: 'default', onPress }],
      });
    },
    [showAlert]
  );

  const AlertModalComponent = React.useCallback(
    () => (
      <AlertModal
        visible={alertState.visible}
        title={alertState.title}
        message={alertState.message}
        icon={alertState.icon}
        actions={alertState.actions}
        dismissable={alertState.dismissable}
        onDismiss={hideAlert}
      />
    ),
    [alertState, hideAlert]
  );

  return {
    // 컴포넌트
    AlertModal: AlertModalComponent,
    
    // 상태 관리
    showAlert,
    hideAlert,
    
    // Alert.alert 호환 메서드들
    alert,
    confirm,
    success,
    error,
    warning,
    
    // 상태 정보
    isVisible: alertState.visible,
  };
}

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 12,
    marginHorizontal: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  message: {
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  actions: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 8,
    minHeight: 44,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
}); 