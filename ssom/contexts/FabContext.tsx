import React, { createContext, useContext, useState, useRef } from 'react';

interface FabContextType {
  fabVisible: boolean;
  setFabVisible: (visible: boolean) => void;
  handleScroll: (event: any) => void;
}

const FabContext = createContext<FabContextType | undefined>(undefined);

export const useFab = () => {
  const context = useContext(FabContext);
  if (!context) {
    throw new Error('useFab must be used within a FabProvider');
  }
  return context;
};

interface FabProviderProps {
  children: React.ReactNode;
}

export const FabProvider: React.FC<FabProviderProps> = ({ children }) => {
  const [fabVisible, setFabVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollThreshold = 1; // 최소 스크롤 거리

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDiff = currentScrollY - lastScrollY.current;

    // 최소 스크롤 거리 이상일 때만 처리 (미세한 스크롤 무시)
    if (Math.abs(scrollDiff) > scrollThreshold) {
      if (scrollDiff > 0 && currentScrollY > 100) {
        // 아래로 스크롤하고 충분히 아래에 있을 때 숨김
        setFabVisible(false);
      } else if (scrollDiff < 0) {
        // 위로 스크롤할 때 보임
        setFabVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    }
  };

  const value: FabContextType = {
    fabVisible,
    setFabVisible,
    handleScroll,
  };

  return (
    <FabContext.Provider value={value}>
      {children}
    </FabContext.Provider>
  );
}; 