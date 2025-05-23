import React, { createContext, useContext, useReducer, useEffect, ReactNode } from "react";
import { AuthState, AuthAction, User, AuthTokens, LoginRequest, ChangePasswordRequest } from "../../../types/auth";
import { STORAGE_KEYS, TOKEN_REFRESH_THRESHOLD } from "../../../constants/auth";
import { StorageUtils } from "../../../utils/storage";
import { AuthService } from "../api/authService";

// 초기 상태
const initialState: AuthState = {
  user: null,
  tokens: null,
  isLoading: true,
  isAuthenticated: false,
  error: null,
};

// 리듀서 함수
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        tokens: action.payload.tokens,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      };

    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        tokens: null,
        isLoading: false,
        isAuthenticated: false,
        error: action.payload,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        tokens: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      };

    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
}

// 컨텍스트 인터페이스
interface AuthContextType {
  state: AuthState;
  login: (credentials: LoginRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<boolean>;
  clearError: () => void;
  refreshTokens: () => Promise<boolean>;
}

// 컨텍스트 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 프로바이더 Props
interface AuthProviderProps {
  children: ReactNode;
}

// 인증 프로바이더 컴포넌트
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // 앱 시작 시 저장된 인증 정보 복원
  useEffect(() => {
    initializeAuth();
  }, []);

  // 토큰 자동 갱신 설정
  useEffect(() => {
    if (state.tokens?.expiresAt) {
      const timeUntilRefresh = state.tokens.expiresAt - Date.now() - TOKEN_REFRESH_THRESHOLD;

      if (timeUntilRefresh > 0) {
        const timer = setTimeout(() => {
          refreshTokens();
        }, timeUntilRefresh);

        return () => clearTimeout(timer);
      }
    }
  }, [state.tokens]);

  /**
   * 앱 시작 시 인증 상태 초기화
   */
  const initializeAuth = async (): Promise<void> => {
    try {
      const [accessToken, refreshToken, userData, expiresAt] = await Promise.all([
        StorageUtils.getSecure(STORAGE_KEYS.ACCESS_TOKEN),
        StorageUtils.getSecure(STORAGE_KEYS.REFRESH_TOKEN),
        StorageUtils.getObject<User>(STORAGE_KEYS.USER_DATA),
        StorageUtils.get(STORAGE_KEYS.TOKEN_EXPIRES_AT),
      ]);

      if (accessToken && refreshToken && userData && expiresAt) {
        const tokens: AuthTokens = {
          accessToken,
          refreshToken,
          expiresAt: parseInt(expiresAt, 10),
        };

        // 토큰이 만료되었는지 확인
        if (tokens.expiresAt > Date.now()) {
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { user: userData, tokens },
          });
        } else {
          // 토큰이 만료된 경우 갱신 시도
          const refreshSuccess = await refreshTokens(refreshToken);
          if (!refreshSuccess) {
            await clearStoredAuth();
          }
        }
      }
    } catch (error) {
      console.error("인증 상태 초기화 실패:", error);
      await clearStoredAuth();
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  /**
   * 로그인
   */
  const login = async (credentials: LoginRequest): Promise<boolean> => {
    dispatch({ type: "LOGIN_START" });

    try {
      // 개발 환경에서는 Mock API 사용
      const response = await AuthService.mockLogin(credentials);

      if (response.success && response.data) {
        const { user, tokens } = response.data;

        // 인증 정보 저장
        await Promise.all([
          StorageUtils.setSecure(STORAGE_KEYS.ACCESS_TOKEN, tokens.accessToken),
          StorageUtils.setSecure(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken),
          StorageUtils.setObject(STORAGE_KEYS.USER_DATA, user),
          StorageUtils.set(STORAGE_KEYS.TOKEN_EXPIRES_AT, tokens.expiresAt.toString()),
        ]);

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, tokens },
        });

        return true;
      } else {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: response.error?.message || "로그인에 실패했습니다.",
        });
        return false;
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      dispatch({
        type: "LOGIN_FAILURE",
        payload: "로그인 중 오류가 발생했습니다.",
      });
      return false;
    }
  };

  /**
   * 로그아웃
   */
  const logout = async (): Promise<void> => {
    try {
      // 서버에 로그아웃 요청 (선택사항)
      if (state.tokens?.accessToken) {
        await AuthService.logout(state.tokens.accessToken);
      }
    } catch (error) {
      console.error("로그아웃 API 호출 실패:", error);
    } finally {
      await clearStoredAuth();
      dispatch({ type: "LOGOUT" });
    }
  };

  /**
   * 비밀번호 변경
   */
  const changePassword = async (data: ChangePasswordRequest): Promise<boolean> => {
    if (!state.tokens?.accessToken) {
      return false;
    }

    try {
      const response = await AuthService.changePassword(data, state.tokens.accessToken);

      if (response.success) {
        // 비밀번호 변경 성공 시 사용자 정보 업데이트
        if (state.user?.isFirstLogin) {
          const updatedUser = { ...state.user, isFirstLogin: false };
          dispatch({ type: "UPDATE_USER", payload: updatedUser });
          await StorageUtils.setObject(STORAGE_KEYS.USER_DATA, updatedUser);
        }
        return true;
      } else {
        dispatch({
          type: "LOGIN_FAILURE",
          payload: response.error?.message || "비밀번호 변경에 실패했습니다.",
        });
        return false;
      }
    } catch (error) {
      console.error("비밀번호 변경 오류:", error);
      dispatch({
        type: "LOGIN_FAILURE",
        payload: "비밀번호 변경 중 오류가 발생했습니다.",
      });
      return false;
    }
  };

  /**
   * 토큰 갱신
   */
  const refreshTokens = async (refreshToken?: string): Promise<boolean> => {
    const tokenToUse = refreshToken || state.tokens?.refreshToken;

    if (!tokenToUse) {
      return false;
    }

    try {
      const response = await AuthService.refreshToken(tokenToUse);

      if (response.success && response.data) {
        const newTokens = response.data;

        await Promise.all([
          StorageUtils.setSecure(STORAGE_KEYS.ACCESS_TOKEN, newTokens.accessToken),
          StorageUtils.setSecure(STORAGE_KEYS.REFRESH_TOKEN, newTokens.refreshToken),
          StorageUtils.set(STORAGE_KEYS.TOKEN_EXPIRES_AT, newTokens.expiresAt.toString()),
        ]);

        if (state.user) {
          dispatch({
            type: "LOGIN_SUCCESS",
            payload: { user: state.user, tokens: newTokens },
          });
        }

        return true;
      } else {
        await clearStoredAuth();
        dispatch({ type: "LOGOUT" });
        return false;
      }
    } catch (error) {
      console.error("토큰 갱신 실패:", error);
      await clearStoredAuth();
      dispatch({ type: "LOGOUT" });
      return false;
    }
  };

  /**
   * 에러 상태 초기화
   */
  const clearError = (): void => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  /**
   * 저장된 인증 정보 삭제
   */
  const clearStoredAuth = async (): Promise<void> => {
    await StorageUtils.clearAuthData();
  };

  const contextValue: AuthContextType = {
    state,
    login,
    logout,
    changePassword,
    clearError,
    refreshTokens,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

// 인증 컨텍스트 훅
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth는 AuthProvider 내부에서 사용되어야 합니다.");
  }

  return context;
}
