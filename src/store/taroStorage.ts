import Taro from '@tarojs/taro'
import { createJSONStorage } from 'zustand/middleware'
import type { StateStorage } from 'zustand/middleware'

const taroStateStorage: StateStorage = {
  getItem: (name) => {
    const value = Taro.getStorageSync<string>(name)
    return value || null
  },
  setItem: (name, value) => {
    Taro.setStorageSync(name, value)
  },
  removeItem: (name) => {
    Taro.removeStorageSync(name)
  },
}

export const taroJsonStorage = createJSONStorage(() => taroStateStorage)
