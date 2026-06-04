import Taro from '@tarojs/taro'
import { getLoginUrl } from './env'

const TAB_BAR_PATHS = new Set([
  '/pages/guest/menu/index',
  '/pages/guest/orders/index',
  '/pages/guest/profile/index',
])

function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

function stringifyQuery(query?: Record<string, unknown>): string {
  if (!query) return ''

  const params = Object.entries(query)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)

  return params.length ? `?${params.join('&')}` : ''
}

export function getCurrentPageUrl(): string {
  const pages = Taro.getCurrentPages()
  const current = pages[pages.length - 1]
  if (!current?.route) return '/pages/guest/menu/index'

  return `${normalizePath(current.route)}${stringifyQuery(current.options as Record<string, unknown>)}`
}

export function appendRedirectToLoginUrl(redirectUrl: string): string {
  const separator = getLoginUrl().includes('?') ? '&' : '?'
  return `${getLoginUrl()}${separator}redirect=${encodeURIComponent(redirectUrl)}`
}

export function isTabBarPath(url: string): boolean {
  const path = normalizePath(url.split('?')[0])
  return TAB_BAR_PATHS.has(path)
}

export function goToLoginWithRedirect(redirectUrl = getCurrentPageUrl()) {
  const loginUrl = appendRedirectToLoginUrl(redirectUrl)
  const currentPath = normalizePath(redirectUrl.split('?')[0])

  if (isTabBarPath(currentPath)) {
    return Taro.navigateTo({ url: loginUrl })
  }

  return Taro.redirectTo({ url: loginUrl })
}

export function goToAuthRedirect(redirectUrl?: string) {
  const target = redirectUrl ? decodeURIComponent(redirectUrl) : '/pages/guest/menu/index'

  if (isTabBarPath(target)) {
    return Taro.switchTab({ url: normalizePath(target.split('?')[0]) })
  }

  return Taro.redirectTo({ url: normalizePath(target) })
}
