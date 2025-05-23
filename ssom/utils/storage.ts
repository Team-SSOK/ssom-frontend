import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * 보안 저장소 유틸리티
 * 민감한 데이터(토큰 등)는 SecureStore, 일반 데이터는 AsyncStorage 사용
 */
export class StorageUtils {
  /**
   * 보안 데이터 저장 (토큰 등)
   */
  static async setSecure(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error("SecureStore 저장 실패:", error);
      throw new Error("보안 데이터 저장에 실패했습니다.");
    }
  }

  /**
   * 보안 데이터 조회
   */
  static async getSecure(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error("SecureStore 조회 실패:", error);
      return null;
    }
  }

  /**
   * 보안 데이터 삭제
   */
  static async deleteSecure(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error("SecureStore 삭제 실패:", error);
      throw new Error("보안 데이터 삭제에 실패했습니다.");
    }
  }

  /**
   * 일반 데이터 저장
   */
  static async set(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error("AsyncStorage 저장 실패:", error);
      throw new Error("데이터 저장에 실패했습니다.");
    }
  }

  /**
   * 일반 데이터 조회
   */
  static async get(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error("AsyncStorage 조회 실패:", error);
      return null;
    }
  }

  /**
   * 일반 데이터 삭제
   */
  static async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("AsyncStorage 삭제 실패:", error);
      throw new Error("데이터 삭제에 실패했습니다.");
    }
  }

  /**
   * 객체를 JSON 문자열로 저장
   */
  static async setObject(key: string, value: object, secure = false): Promise<void> {
    const jsonString = JSON.stringify(value);
    if (secure) {
      await this.setSecure(key, jsonString);
    } else {
      await this.set(key, jsonString);
    }
  }

  /**
   * JSON 문자열을 객체로 조회
   */
  static async getObject<T>(key: string, secure = false): Promise<T | null> {
    const jsonString = secure ? await this.getSecure(key) : await this.get(key);
    if (!jsonString) return null;

    try {
      return JSON.parse(jsonString) as T;
    } catch (error) {
      console.error("JSON 파싱 실패:", error);
      return null;
    }
  }

  /**
   * 모든 인증 관련 데이터 삭제
   */
  static async clearAuthData(): Promise<void> {
    const keysToDelete = ["auth_access_token", "auth_refresh_token", "auth_user_data", "auth_token_expires_at"];

    await Promise.all([
      ...keysToDelete.map((key) => this.deleteSecure(key).catch(() => {})),
      ...keysToDelete.map((key) => this.remove(key).catch(() => {})),
    ]);
  }
}
