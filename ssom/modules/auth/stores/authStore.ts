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

export interface User {
  username: string;
  department: string;
  expiresIn: number;
  biometricEnabled: boolean;
  lastLoginAt: string;
}

export interface UserProfile {
  employeeId: string;
  username: string;
  phoneNumber: string;
  department: string;
  departmentCode: number;
  githubId: string;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: SignInRequest) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (data: PasswordChangeRequest) => Promise<void>;
  getProfile: () => Promise<void>;
  initialize: () => Promise<void>;
  clearAuth: () => Promise<void>;
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
      profile: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: SignInRequest) => {
        set({ isLoading: true });

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
          });
        } catch (error) {
          // API 에러 또는 토큰 저장 실패 시 상태 초기화
          set({
            user: null,
            isAuthenticated: false,
          });
          
          // 에러 메시지 가공 후 다시 throw
          if (error instanceof Error) {
            if(__DEV__) console.error('로그인 실패:', error);
            throw error;
          } else {
            throw new Error('로그인에 실패했습니다.');
          }
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        set({ isLoading: true });

        try {
          // 서버에 로그아웃 요청
          await authApi.logout();
        } catch (error) {
          if(__DEV__) console.error('로그아웃 API 호출 실패, 로컬 상태만 정리합니다.');
          throw error;
        } finally {
          await clearTokens();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },

      changePassword: async (data: PasswordChangeRequest) => {
        set({ isLoading: true });

        try {
          await authApi.changePassword(data);
        } catch (error) {
          if(__DEV__) console.error('비밀번호 변경 실패:', error);
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      getProfile: async () => {
        try {
          const profile = await authApi.getProfile();
          set({ profile: profile });

        } catch (error) {
          if(__DEV__) console.error('프로필 조회 실패:', error);
          throw error;
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
              });
            } else {
              // 유효하지 않은 토큰 형식이면 리셋
              console.warn('[AuthStore] 유효하지 않은 토큰 형식, 인증 상태 리셋');
              await get().clearAuth();
            }
          } else {
            // 토큰이나 사용자 정보가 불완전하면 리셋
            await get().clearAuth();
          }
        } catch (error) {
          // Auth 초기화 실패 시 자동으로 리셋
          console.warn('[AuthStore] 초기화 실패, 인증 상태 리셋:', error);
          await get().clearAuth();
        }
      },

      clearAuth: async () => {
        await clearTokens();
        set({
          user: null,
          isAuthenticated: false,
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
