import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  authApi,
  type SignInRequest,
  type PasswordChangeRequest,
} from '@/modules/auth/apis/authApi';
import {
  saveTokens,
  clearTokens,
  getTokens,
  setItem,
  getItem,
  removeItem,
} from '@/services/tokenService';

interface User {
  username: string;
  department: string;
  expiresIn: number;
  biometricEnabled: boolean;
  lastLoginAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: SignInRequest) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (data: PasswordChangeRequest) => Promise<void>;
  initialize: () => Promise<void>;
  clearError: () => void;
  resetAuth: () => Promise<void>;
}

const persistStorage = {
  getItem: (key: string) => getItem(key),
  setItem: (key: string, value: string) => setItem(key, value),
  removeItem: (key: string) => removeItem(key),
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: SignInRequest) => {
        set({ isLoading: true, error: null });

        try {
          const response = await authApi.signIn(credentials);
          const { user, accessToken, refreshToken } = response;

          const tokenSaved = await saveTokens(accessToken, refreshToken);
          if (!tokenSaved) {
            throw new Error('토큰 저장에 실패했습니다.');
          }

          const authUser: User = {
            username: user.username,
            department: user.department,
            expiresIn: user.expiresIn,
            biometricEnabled: user.biometricEnabled,
            lastLoginAt: user.lastLoginAt,
          };

          set({
            user: authUser,
            isAuthenticated: true,
            error: null,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : '로그인에 실패했습니다.';
          set({
            user: null,
            isAuthenticated: false,
            error: errorMessage,
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });

        try {
          // 서버에 로그아웃 요청
          await authApi.logout();
        } catch (error) {
          // 로그아웃 API 실패해도 로컬 상태는 정리
          console.warn('로그아웃 API 호출 실패, 로컬 상태만 정리합니다.');
        } finally {
          await clearTokens();
          set({
            user: null,
            isAuthenticated: false,
            error: null,
            isLoading: false,
          });
        }
      },

      changePassword: async (data: PasswordChangeRequest) => {
        set({ isLoading: true, error: null });

        try {
          await authApi.changePassword(data);
          set({ error: null });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : '비밀번호 변경에 실패했습니다.';
          set({ error: errorMessage });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      initialize: async () => {
        try {
          const { accessToken, refreshToken } = await getTokens();
          const persistedUser = get().user;

          // 토큰과 사용자 정보가 모두 있는 경우에만 인증 상태 유지
          if (accessToken && refreshToken && persistedUser) {
            // 토큰 유효성 간단 검증 (형식 체크)
            const isValidToken = accessToken.split('.').length === 3; // JWT 형식 확인
            
            if (isValidToken) {
              set({
                isAuthenticated: true,
                error: null,
              });
            } else {
              // 유효하지 않은 토큰 형식이면 리셋
              console.warn('[AuthStore] 유효하지 않은 토큰 형식, 인증 상태 리셋');
              await get().resetAuth();
            }
          } else {
            // 토큰이나 사용자 정보가 불완전하면 리셋
            await get().resetAuth();
          }
        } catch (error) {
          // Auth 초기화 실패 시 자동으로 리셋
          console.warn('[AuthStore] 초기화 실패, 인증 상태 리셋:', error);
          await get().resetAuth();
        }
      },

      clearError: () => {
        set({ error: null });
      },

      resetAuth: async () => {
        await clearTokens();
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },
    }),
    {
      name: 'authStorage',
      storage: createJSONStorage(() => persistStorage),
      partialize: ({ user }) => ({ user }),
      onRehydrateStorage: () => (state) => {
        if (__DEV__) console.log('[AuthStore] persist 복원 완료');
      },
    },
  ),
);
