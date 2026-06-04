import React, { useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { useAuth } from '../../store'

const FEATURES = [
  { icon: '🌿', text: '新鲜食材' },
  { icon: '🍳', text: '私厨定制' },
  { icon: '🚚', text: '准时送达' },
]

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
    <View className="food-page flex flex-col items-center justify-center px-8">
      {/* Logo */}
      <View className="text-center mb-12">
        <View
          className="w-[120px] h-[120px] rounded-[32px] flex items-center justify-center mx-auto mb-6"
          style={{
            background: 'linear-gradient(135deg, #5b9b58, #2f6d4c)',
            boxShadow: '0 12px 40px rgba(91, 155, 88, 0.3)',
          }}
        >
          <Text className="text-[56px]">🥗</Text>
        </View>
        <Text className="text-[32px] font-bold text-[#2f3327] tracking-[4px] block mb-2">
          轻食
        </Text>
        <Text className="text-sm text-[#8B7355] block">家庭私厨 · 健康轻食</Text>
      </View>

      {/* Feature chips */}
      <View className="flex flex-wrap justify-center gap-2.5 mb-12">
        {FEATURES.map((item) => (
          <View
            key={item.text}
            className="px-4 py-2 rounded-full border flex items-center gap-1"
            style={{
              background: 'rgba(255, 255, 255, 0.7)',
              borderColor: 'rgba(232, 221, 208, 0.95)',
            }}
          >
            <Text className="text-[13px] text-[#4A3728]">
              {item.icon} {item.text}
            </Text>
          </View>
        ))}
      </View>

      {/* Enter button */}
      <View
        className="w-full max-w-[280px] rounded-full py-4 flex items-center justify-center active:scale-[0.98] transition-transform mb-4"
        style={{
          background: 'linear-gradient(135deg, #ed8f3d, #e06633)',
          boxShadow: '0 12px 26px rgba(224, 102, 51, 0.26)',
        }}
        onClick={handleEnter}
      >
        <Text className="text-white text-lg font-semibold">进入轻食厨房</Text>
      </View>

      {/* Guest button */}
      <View
        className="w-full max-w-[280px] rounded-full py-3.5 flex items-center justify-center border active:scale-[0.98] transition-transform"
        style={{
          background: 'transparent',
          borderColor: 'rgba(232, 221, 208, 0.95)',
        }}
        onClick={handleEnter}
      >
        <Text className="text-lg text-[#4A3728]">👋 游客浏览</Text>
      </View>

      {/* Footer */}
      <View className="absolute bottom-10">
        <Text className="text-xs text-[#A39584]">轻食小程序 · 让每一餐都健康美味</Text>
      </View>
    </View>
  )
}

export default IndexPage
