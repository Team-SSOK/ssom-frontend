import { useState, useCallback } from 'react';

interface UseRefreshControlOptions {
  onRefresh: () => Promise<void> | void;
}

export function useRefreshControl({ onRefresh }: UseRefreshControlOptions) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 300);
    }
  }, [onRefresh, isRefreshing]);

  return {
    refreshing: isRefreshing,
    onRefresh: handleRefresh,
  };
} 