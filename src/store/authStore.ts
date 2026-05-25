import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Taro from '@tarojs/taro'

interface UserInfo {
  id: string
  username?: string
  nickname?: string
  avatar?: string
  role: 'admin' | 'merchant' | 'user'
  status?: string
  openId?: string
}

interface AuthState {
  isLogin: boolean
  token: string | null
  userInfo: UserInfo | null
}

interface AuthActions {
  login: (token: string, userInfo: UserInfo) => void
  logout: () => void
  updateUserInfo: (userInfo: UserInfo) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLogin: false,
      token: null,
      userInfo: null,

      login: (token, userInfo) => {
        Taro.setStorageSync('token', token)
        Taro.setStorageSync('userInfo', userInfo)
        set({ isLogin: true, token, userInfo })
      },

      logout: () => {
        Taro.removeStorageSync('token')
        Taro.removeStorageSync('userInfo')
        set({ isLogin: false, token: null, userInfo: null })
      },

      updateUserInfo: (userInfo) => {
        Taro.setStorageSync('userInfo', userInfo)
        set({ userInfo })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        userInfo: state.userInfo,
        isLogin: state.isLogin,
      }),
    }
  )
)

export const useAuth = () => {
  const store = useAuthStore()
  return {
    ...store,
    login: (token: string, userInfo: UserInfo) => store.login(token, userInfo),
  }
}
