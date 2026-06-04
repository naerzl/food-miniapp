import Taro from '@tarojs/taro'
import { useAuthStore } from '../store/authStore'

declare const __API_BASE_URL__: string

const API_BASE_URL = __API_BASE_URL__
const IS_H5 = Taro.getEnv() === Taro.ENV_TYPE.WEB

export interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: unknown
  header?: Record<string, string>
}

export function getBaseUrl(): string {
  return API_BASE_URL
}

function getErrorMessage(statusCode: number, data: unknown): string {
  const responseData = data as { message?: string } | undefined

  switch (statusCode) {
    case 401:
      return '登录已过期，请重新登录'
    case 403:
      return '没有权限执行此操作'
    case 404:
      return '请求的资源不存在'
    case 500:
      return '服务器内部错误'
    default:
      return responseData?.message || `请求失败(${statusCode})`
  }
}

function handleUnauthorized() {
  useAuthStore.getState().logout()
  setTimeout(() => {
    Taro.redirectTo({
      url: IS_H5 ? '/pages/guest/login/index' : '/pages/index/index',
    })
  }, 1500)
}

export async function request<T>(options: RequestOptions): Promise<T> {
  const token = Taro.getStorageSync('token')
  const header: Record<string, string> = {
    ...(options.header || {}),
  }

  if (token) {
    header.Authorization = `Bearer ${token}`
  }

  try {
    const response = await Taro.request({
      url: `${API_BASE_URL}${options.url}`,
      method: options.method || 'GET',
      data: options.data,
      header,
      timeout: 10000,
    })

    if (response.statusCode >= 400) {
      const message = getErrorMessage(response.statusCode, response.data)

      if (response.statusCode === 401) {
        handleUnauthorized()
      }

      Taro.showToast({ title: message, icon: 'none' })
      return Promise.reject(new Error(message))
    }

    const data = response.data as { code?: number; message?: string; data?: unknown } | T

    // 检查是否是标准的 ApiResponse 格式 { code, message, data }
    if (data && typeof data === 'object' && 'code' in data && typeof data.code === 'number') {
      // code 为 0 表示成功，返回 data 字段
      if (data.code === 0) {
        return ('data' in data ? data.data : data) as T
      }
      // code 不为 0 表示业务错误
      const message = data.message || '操作失败'
      Taro.showToast({ title: message, icon: 'none' })
      return Promise.reject(new Error(message))
    }

    // 如果不是标准格式，直接返回（兼容旧接口）
    return data as T
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)

    if (message.includes('timeout') || message.includes('超时')) {
      Taro.showToast({ title: '请求超时，请重试', icon: 'none' })
    } else if (message.includes('Network Error') || message.includes('fail')) {
      Taro.showToast({ title: '网络错误，请检查网络', icon: 'none' })
    }

    return Promise.reject(error)
  }
}
