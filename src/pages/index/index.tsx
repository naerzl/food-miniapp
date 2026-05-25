import React, { useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useAuth } from '../../store'

const IndexPage: React.FC = () => {
  const { isLogin } = useAuth()

  useEffect(() => {
    if (isLogin) {
      Taro.switchTab({ url: '/pages/guest/menu/index' })
    }
  }, [isLogin])

  const handleEnter = () => {
    Taro.switchTab({ url: '/pages/guest/menu/index' })
  }

  return (
    <View className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center px-8">
      {/* Logo */}
      <View className="text-center mb-16">
        <View className="w-28 h-28 bg-[#F5E6D3] rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Text className="text-6xl">🍽️</Text>
        </View>
        <Text className="text-2xl font-bold text-[#4A3728] block mb-2">私厨点餐助手</Text>
        <Text className="text-sm text-[#A39584] block">家庭私厨，美味随时享</Text>
      </View>

      {/* Enter button */}
      <View
        className="w-full max-w-sm bg-[#E8833A] rounded-full py-4 flex items-center justify-center shadow-xl shadow-[#E8833A]/25 active:scale-[0.98] transition-transform"
        onClick={handleEnter}
      >
        <Text className="text-white text-lg font-semibold">进入点餐</Text>
      </View>

      {/* Footer */}
      <View className="absolute bottom-16">
        <Text className="text-xs text-[#D0C8BC]">让家庭用餐更简单、更温馨</Text>
      </View>
    </View>
  )
}

export default IndexPage
