import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useAuth } from '../../../store'
import { reqPostWechatLogin } from '../../../services'

const WechatLoginPage: React.FC = () => {
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleWechatLogin = async () => {
    try {
      setLoading(true)
      const { code } = await Taro.login()
      const res = await reqPostWechatLogin({ code })
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
      console.error('微信登录失败:', error)
      Taro.showToast({ title: '登录失败，请重试或使用账号登录', icon: 'none', duration: 2000 })
    } finally {
      setLoading(false)
    }
  }

  const goToAccountLogin = () => {
    Taro.redirectTo({ url: '/pages/guest/login/index' })
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
            <View className="flex flex-col items-center py-8">
              <View className="mb-6">
                <Text className="text-6xl">💬</Text>
              </View>
              <Text className="text-lg font-bold text-[#2f3327] mb-2">微信一键登录</Text>
              <Text className="text-sm text-[#8B7355] text-center mb-8">
                使用微信账号快速登录，享受更多服务
              </Text>

              <View
                className={`w-full flex items-center justify-center rounded-full py-3.5 shadow-lg active:scale-[0.98] transition-transform ${
                  loading ? 'bg-[#E0C8B0]' : 'bg-[#07C160]'
                }`}
                onClick={loading ? undefined : handleWechatLogin}
              >
                <Text className="text-base font-semibold text-white">
                  {loading ? '登录中...' : '微信一键登录'}
                </Text>
              </View>

              <View className="mt-6 flex items-center gap-2">
                <View className="h-px w-16 bg-[#E8DDD0]" />
                <Text className="text-xs text-[#A39584]">其他方式</Text>
                <View className="h-px w-16 bg-[#E8DDD0]" />
              </View>

              <View
                className="mt-4 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                onClick={goToAccountLogin}
              >
                <Text className="text-sm text-[#E8833A] font-medium">账号密码登录</Text>
                <Text className="text-sm text-[#E8833A]">→</Text>
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

export default WechatLoginPage
