import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { useAuthStore } from '../store/authStore'
import { goToLoginWithRedirect } from '../utils/authRedirect'

interface AuthGuardProps {
  children: React.ReactNode
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const hydrated = useAuthStore((state) => state.hydrated)
  const isLogin = useAuthStore((state) => state.isLogin)
  const token = useAuthStore((state) => state.token)
  const [redirecting, setRedirecting] = useState(false)

  const hasLoginInfo = Boolean(isLogin && token)

  useEffect(() => {
    if (!hydrated || hasLoginInfo || redirecting) return

    setRedirecting(true)
    goToLoginWithRedirect()
  }, [hydrated, hasLoginInfo, redirecting])

  if (!hydrated || !hasLoginInfo || redirecting) {
    return (
      <View className="food-page flex items-center justify-center">
        <View className="food-mobile flex items-center justify-center">
          <Text className="text-sm text-[#A39584]">正在确认登录状态...</Text>
        </View>
      </View>
    )
  }

  return <>{children}</>
}

// 用于需要登录权限的页面，确保 children 组件的 hooks 不会在未登录时执行
export function withAuthGuard<P extends object>(WrappedComponent: React.ComponentType<P>) {
  const WithAuthGuard = (props: P) => (
    <AuthGuard>
      <WrappedComponent {...props} />
    </AuthGuard>
  )
  WithAuthGuard.displayName = `withAuthGuard(${WrappedComponent.displayName || WrappedComponent.name})`
  return WithAuthGuard
}
