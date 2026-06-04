import React, { useState, useCallback } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import { useAuth } from '../../../store'
import { reqPostLogin } from '../../../services'
import { isWeapp } from '../../../utils/env'

type AuthUser = {
  id?: string
  username?: string
  nickname?: string
  avatar?: string
  role?: string
}

type AuthPayload = {
  accessToken?: string
  token?: string
  user?: AuthUser
}

function normalizeAuthResponse(response: unknown): {
  token: string
  user: AuthUser & { id: string }
} {
  const maybeResponse = response as AuthPayload & { data?: AuthPayload }
  const payload =
    maybeResponse.accessToken || maybeResponse.token ? maybeResponse : maybeResponse.data
  const token = payload?.accessToken || payload?.token

  if (!token || !payload?.user?.id) {
    throw new Error('登录响应数据异常')
  }

  return {
    token,
    user: { ...payload.user, id: payload.user.id },
  }
}

const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [rememberLogin, setRememberLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [shakeKey, setShakeKey] = useState(0)

  const triggerShake = useCallback(() => {
    setShakeKey((k) => k + 1)
  }, [])

  const handleLogin = async () => {
    setUsernameError('')
    setPasswordError('')

    let hasError = false
    if (!username.trim()) {
      setUsernameError('请输入账号')
      hasError = true
    }
    if (!password) {
      setPasswordError('请输入密码')
      hasError = true
    }

    if (hasError) {
      triggerShake()
      return
    }

    setLoading(true)
    try {
      const res = await reqPostLogin({
        username: username.trim(),
        password,
      })
      const auth = normalizeAuthResponse(res)

      login(auth.token, {
        id: auth.user.id,
        username: auth.user.username,
        nickname: auth.user.nickname,
        avatar: auth.user.avatar,
        role: (auth.user.role || 'user') as 'admin' | 'merchant' | 'user',
      })
      Taro.showToast({ title: '登录成功', icon: 'success', duration: 1000 })
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/guest/menu/index' })
      }, 1000)
    } catch (error) {
      console.error('登录失败:', error)
      Taro.showToast({ title: '登录失败，请检查账号密码', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className="food-page">
      <View className="food-mobile">
        <View className="food-login">
          <View className="food-login__header fade-in">
            <View className="food-login__logo">
              <Text className="text-[42px]">🥗</Text>
            </View>
            <Text className="block text-[26px] font-bold tracking-[3px] text-[#2f3327]">
              轻食
            </Text>
            <Text className="mt-1.5 block text-[13px] text-[#8B7355]">家庭私厨 · 健康轻食</Text>
          </View>

          <View className="food-card food-login-card fade-in">
            <View
              className={`food-form-group ${shakeKey ? 'food-form-group--shake' : ''}`}
              key={`u-${shakeKey}`}
            >
              <Text className="food-form-label">账号</Text>
              <View
                className={`food-input-shell ${usernameError ? 'food-input-shell--error' : ''}`}
              >
                <Text className="food-input-prefix">👤</Text>
                <Input
                  className="food-input-control"
                  placeholder="请输入手机号或用户名"
                  placeholderStyle="color: #A39584; font-size: 15px;"
                  value={username}
                  onInput={(e) => {
                    setUsername(e.detail.value)
                    if (usernameError) setUsernameError('')
                  }}
                />
              </View>
              {usernameError && <Text className="food-form-error">{usernameError}</Text>}
            </View>

            <View
              className={`food-form-group ${shakeKey ? 'food-form-group--shake' : ''}`}
              key={`p-${shakeKey}`}
            >
              <Text className="food-form-label">密码</Text>
              <View
                className={`food-input-shell ${passwordError ? 'food-input-shell--error' : ''}`}
              >
                <Text className="food-input-prefix">🔒</Text>
                <Input
                  className="food-input-control"
                  password={!showPassword}
                  placeholder="请输入密码"
                  placeholderStyle="color: #A39584; font-size: 15px;"
                  value={password}
                  onInput={(e) => {
                    setPassword(e.detail.value)
                    if (passwordError) setPasswordError('')
                  }}
                />
                <View
                  className="food-input-suffix"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Text>{showPassword ? '🙈' : '👁️'}</Text>
                </View>
              </View>
              {passwordError && <Text className="food-form-error">{passwordError}</Text>}
            </View>

            <View className="food-login-row">
              <View className="food-login-check" onClick={() => setRememberLogin(!rememberLogin)}>
                <View
                  className={`food-login-check__box ${
                    rememberLogin ? 'food-login-check__box--active' : ''
                  }`}
                >
                  {rememberLogin && <Text className="text-[11px] text-white">✓</Text>}
                </View>
                <Text className="text-[13px] text-[#8B7355]">记住登录</Text>
              </View>
              <View onClick={() => Taro.showToast({ title: '请联系客服重置密码', icon: 'none' })}>
                <Text className="text-[13px] font-medium text-[#E8833A]">忘记密码？</Text>
              </View>
            </View>

            <View
              className={`food-login-submit active:scale-[0.98] transition-transform ${
                loading ? 'bg-[#E0C8B0]' : 'food-action'
              }`}
              onClick={loading ? undefined : handleLogin}
            >
              <Text className="text-[17px] font-bold tracking-[1px] text-white">
                {loading ? '登录中' : '登 录'}
              </Text>
            </View>

            <View className="food-login-divider">
              <View className="h-px flex-1 bg-[#E8DDD0]" />
              <Text className="text-xs text-[#A39584]">其他登录方式</Text>
              <View className="h-px flex-1 bg-[#E8DDD0]" />
            </View>

            <View className="food-login-social">
              {isWeapp && (
                <View
                  className="food-login-social__button active:scale-95"
                  onClick={() => Taro.redirectTo({ url: '/pages/guest/wechat-login/index' })}
                >
                  <Text className="text-2xl">💬</Text>
                </View>
              )}
              <View
                className="food-login-social__button active:scale-95"
                onClick={() => Taro.showToast({ title: '验证码登录暂未开放', icon: 'none' })}
              >
                <Text className="text-2xl">📱</Text>
              </View>
            </View>
          </View>

          <View className="mt-auto pb-10 text-center fade-in">
            <Text className="text-[13px] text-[#8B7355]">还没有账号？</Text>
            <View
              className="inline-flex"
              onClick={() => Taro.showToast({ title: '请联系厨师长获取账号', icon: 'none' })}
            >
              <Text className="text-[13px] font-semibold text-[#E8833A]"> 注册新账号</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default LoginPage
