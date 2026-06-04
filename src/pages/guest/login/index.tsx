import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import { useAuth } from '../../../store'
import { reqPostLogin, reqPostRegister } from '../../../services'

const LoginPage: React.FC = () => {
  const { login } = useAuth()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Taro.showToast({ title: '请输入用户名和密码', icon: 'none' })
      return
    }
    setLoading(true)
    try {
      const res = await reqPostLogin({
        username: username.trim(),
        password,
      })

      console.log(res, '============')
      login(res.accessToken, {
        id: res.user.id,
        username: res.user.username,
        nickname: res.user.nickname,
        avatar: res.user.avatar,
        role: res.user.role as 'admin' | 'merchant' | 'user',
      })
      Taro.showToast({ title: '登录成功', icon: 'success', duration: 1000 })
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/guest/menu/index' })
      }, 1000)
    } catch (error) {
      Taro.showToast({ title: '登录失败，请检查账号密码', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) {
      Taro.showToast({ title: '请输入用户名和密码', icon: 'none' })
      return
    }
    if (password.length < 6) {
      Taro.showToast({ title: '密码至少6位', icon: 'none' })
      return
    }
    setLoading(true)
    try {
      const res = await reqPostRegister({
        username: username.trim(),
        password,
        nickname: nickname.trim() || username.trim(),
      })
      login(res.accessToken, {
        id: res.user.id,
        username: res.user.username,
        nickname: res.user.nickname,
        avatar: res.user.avatar,
        role: res.user.role as 'admin' | 'merchant' | 'user',
      })
      Taro.showToast({ title: '注册成功', icon: 'success', duration: 1000 })
      setTimeout(() => {
        Taro.switchTab({ url: '/pages/guest/menu/index' })
      }, 1000)
    } catch (error) {
      Taro.showToast({ title: '注册失败，请重试', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = mode === 'login' ? handleLogin : handleRegister

  return (
    <View className="food-page flex flex-col items-center justify-center px-8">
      {/* Logo */}
      <View className="food-empty__icon">
        <Text className="text-5xl">🍽️</Text>
      </View>
      <Text className="text-2xl font-bold text-[#4A3728] block mb-1">私厨点餐助手</Text>
      <Text className="text-sm text-[#A39584] block mb-3">
        {mode === 'login' ? '登录你的账号' : '创建新账号'}
      </Text>
      <View className="flex gap-2 mb-8">
        <View className="bg-white/70 border border-white px-3 py-1.5 rounded-full">
          <Text className="text-xs text-[#5B8A4D] font-semibold">菜单浏览</Text>
        </View>
        <View className="bg-white/70 border border-white px-3 py-1.5 rounded-full">
          <Text className="text-xs text-[#E8833A] font-semibold">虚拟支付</Text>
        </View>
      </View>

      {/* Form */}
      <View className="w-full max-w-sm space-y-4">
        <View className="food-card px-4 py-3.5">
          <Text className="text-xs text-[#A39584] block mb-1.5">用户名</Text>
          <Input
            className="w-full text-sm text-[#4A3728]"
            placeholder="请输入用户名"
            placeholderStyle="color: #CCC; font-size: 14px;"
            value={username}
            onInput={(e) => setUsername(e.detail.value)}
          />
        </View>

        <View className="food-card px-4 py-3.5">
          <Text className="text-xs text-[#A39584] block mb-1.5">密码</Text>
          <Input
            className="w-full text-sm text-[#4A3728]"
            password
            placeholder="请输入密码"
            placeholderStyle="color: #CCC; font-size: 14px;"
            value={password}
            onInput={(e) => setPassword(e.detail.value)}
          />
        </View>

        {mode === 'register' && (
          <View className="food-card px-4 py-3.5">
            <Text className="text-xs text-[#A39584] block mb-1.5">昵称（选填）</Text>
            <Input
              className="w-full text-sm text-[#4A3728]"
              placeholder="给自己取个名字吧"
              placeholderStyle="color: #CCC; font-size: 14px;"
              value={nickname}
              onInput={(e) => setNickname(e.detail.value)}
            />
          </View>
        )}

        <View
          className={`w-full rounded-full py-3.5 flex items-center justify-center shadow-lg active:scale-[0.98] transition-transform ${
            loading ? 'bg-[#E0C8B0]' : 'food-action'
          }`}
          onClick={loading ? undefined : handleSubmit}
        >
          <Text className="text-white font-semibold text-base">
            {loading
              ? mode === 'login'
                ? '登录中...'
                : '注册中...'
              : mode === 'login'
                ? '登录'
                : '注册'}
          </Text>
        </View>
      </View>

      {/* Switch mode */}
      <View className="mt-6 flex items-center gap-1">
        <Text className="text-sm text-[#A39584]">
          {mode === 'login' ? '还没有账号？' : '已有账号？'}
        </Text>
        <View
          onClick={() => {
            setMode(mode === 'login' ? 'register' : 'login')
            setPassword('')
          }}
        >
          <Text className="text-sm text-[#E8833A] font-semibold">
            {mode === 'login' ? '去注册' : '去登录'}
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View className="absolute bottom-10">
        <Text className="text-xs text-[#D0C8BC]">让家庭用餐更简单、更温馨</Text>
      </View>
    </View>
  )
}

export default LoginPage
