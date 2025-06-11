import { useState, useEffect, useMemo } from 'react';
import { useLogStore } from '../stores/logStore';
import { useToast } from '@/hooks/useToast';

export interface LogFilters {
  searchText: string;
  selectedLevel: string;
  selectedService: string;
}

export function useLogFilters() {
  const toast = useToast();
  const [searchText, setSearchText] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('ALL');
  const [selectedService, setSelectedService] = useState('ALL');
  
  const { 
    logs, 
    services, 
    isLoading, 
    isLoadingMore,
    hasMoreLogs,
    fetchInitialLogs,
    fetchMoreLogs,
    fetchServices, 
    setFilters,
    resetPagination
  } = useLogStore();

  // 서비스 목록 로드
  useEffect(() => {
    const loadServices = async () => {
      try {
        await fetchServices();
      } catch (error) {
        toast.showError({
          title: '서비스 목록 로드 실패',
          message: '서비스 목록을 불러오는데 실패했습니다.'
        });
      }
    };

    loadServices();
  }, [fetchServices]);

  // 필터 변경 시 서버에서 데이터 다시 로드 (무한 스크롤 사용)
  useEffect(() => {
    const applyFilters = async () => {
      const filters: { app?: string; level?: string } = {};
      
      if (selectedLevel !== 'ALL') {
        filters.level = selectedLevel;
      }
      
      if (selectedService !== 'ALL') {
        filters.app = selectedService;
      }
      
      try {
        setFilters(filters);
        resetPagination(); // 페이지네이션 상태 초기화
        await fetchInitialLogs(filters); // 무한 스크롤을 위한 초기 로그 조회
      } catch (error) {
        toast.showError({
          title: '로그 로드 실패',
          message: '로그 데이터를 불러오는데 실패했습니다.'
        });
      }
    };

    applyFilters();
  }, [selectedLevel, selectedService, setFilters, fetchInitialLogs, resetPagination]);

  // 현재 필터 상태를 객체로 반환
  const currentFilters = useMemo((): LogFilters => ({
    searchText,
    selectedLevel,
    selectedService
  }), [searchText, selectedLevel, selectedService]);

  return {
    // 상태
    logs,
    services,
    isLoading,
    isLoadingMore,
    hasMoreLogs,
    currentFilters,
    
    // 액션
    setSearchText,
    setSelectedLevel,
    setSelectedService,
    fetchMoreLogs,
  };
} 