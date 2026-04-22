import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Taro from '@tarojs/taro';

interface UserInfo {
  id: string;
  username?: string;
  nickname?: string;
  avatar?: string;
  role: 'admin' | 'merchant' | 'user';
  status?: string;
  openId?: string;
}

interface AuthState {
  isLogin: boolean;
  token: string | null;
  userInfo: UserInfo | null;
  role: 'guest' | 'chef' | null;
}

interface AuthActions {
  login: (token: string, userInfo: UserInfo, role: 'guest' | 'chef') => void;
  logout: () => void;
  updateUserInfo: (userInfo: UserInfo) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLogin: false,
      token: null,
      userInfo: null,
      role: null,

      login: (token, userInfo, role) => {
        Taro.setStorageSync('token', token);
        Taro.setStorageSync('userInfo', userInfo);
        Taro.setStorageSync('role', role);
        set({ isLogin: true, token, userInfo, role });
      },

      logout: () => {
        Taro.removeStorageSync('token');
        Taro.removeStorageSync('userInfo');
        Taro.removeStorageSync('role');
        set({ isLogin: false, token: null, userInfo: null, role: null });
      },

      updateUserInfo: (userInfo) => {
        Taro.setStorageSync('userInfo', userInfo);
        set({ userInfo });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        userInfo: state.userInfo,
        role: state.role,
        isLogin: state.isLogin,
      }),
    }
  )
);

// 兼容旧 API 的 hook
export const useAuth = () => {
  const store = useAuthStore();
  return {
    ...store,
    login: (token: string, userInfo: UserInfo, role: 'guest' | 'chef') => store.login(token, userInfo, role),
  };
};
