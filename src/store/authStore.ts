import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Taro from '@tarojs/taro'
import { connectWebSocket, disconnectWebSocket } from '../services/websocket'

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
  hydrated: boolean
}

interface AuthActions {
  login: (token: string, userInfo: UserInfo) => void
  logout: () => void
  updateUserInfo: (userInfo: UserInfo) => void
  setHydrated: (hydrated: boolean) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLogin: false,
      token: null,
      userInfo: null,
      hydrated: false,

      login: (token, userInfo) => {
        Taro.setStorageSync('token', token)
        Taro.setStorageSync('userInfo', userInfo)
        set({ isLogin: true, token, userInfo })
        connectWebSocket(userInfo.id).catch(err => { console.error('WebSocket 连接失败:', err) })
      },

      logout: () => {
        disconnectWebSocket()
        Taro.removeStorageSync('token')
        Taro.removeStorageSync('userInfo')
        set({ isLogin: false, token: null, userInfo: null })
      },

      updateUserInfo: (userInfo) => {
        Taro.setStorageSync('userInfo', userInfo)
        set({ userInfo })
      },

      setHydrated: (hydrated) => {
        set({ hydrated })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        userInfo: state.userInfo,
        isLogin: state.isLogin,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.setHydrated(true)
      },
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
